import { getMonthDateRange } from "@/utils/date";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateTelegramInitData, ValidatedTelegramData } from "@/lib/security/validate-telegram-data";
import { checkRateLimit } from "@/lib/rate-limiter";

const extractAndValidateAuth = (request: Request): ValidatedTelegramData | null => {
  const initDataHeader = request.headers.get("x-telegram-init-data");
  if (initDataHeader) {
    return validateTelegramInitData(initDataHeader);
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("tma ")) {
    return validateTelegramInitData(authHeader.slice(4));
  }

  return null;
};

export const GET = async (request: Request) => {
  try {
    const authData = extractAndValidateAuth(request);
    if (!authData) {
      return NextResponse.json(
        { error: "Telegram Mini App data မှန်ကန်မှု မရှိပါ" },
        { status: 401 },
      );
    }

    const rateLimit = checkRateLimit(`tx:${authData.user.id}`, 30);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Request limit exceeded" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) } },
      );
    }

    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get("telegramId");

    if (telegramId && String(authData.user.id) !== telegramId) {
      return NextResponse.json(
        { error: "Telegram ID မမှန်ကန်ပါ" },
        { status: 403 },
      );
    }
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    if (!telegramId) {
      return NextResponse.json(
        { error: "Telegram ID မပါဝင်ပါ" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User မတွေ့ပါ" }, { status: 404 });
    }

    const now = new Date();
    const requestedMonth = monthParam ? Number(monthParam) : now.getMonth() + 1;
    const requestedYear = yearParam ? Number(yearParam) : now.getFullYear();

    const { startDate, endDate } = getMonthDateRange(
      requestedYear,
      requestedMonth,
    );

    // Fetch all valid transactions up to the end of selected month
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        reversedAt: null,
        createdAt: {
          lt: endDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let carriedForwardBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    const currentMonthTransactions = [];

    // Separate previous transactions and current month transactions cleanly
    for (const item of transactions) {
      if (item.createdAt < startDate) {
        // Rollover Balance Calculation
        if (item.type === "INCOME") {
          carriedForwardBalance += item.amount;
        } else if (item.type === "EXPENSE") {
          carriedForwardBalance -= item.amount;
        }
      } else {
        // Selected Month Transactions
        currentMonthTransactions.push(item);
        if (item.type === "INCOME") {
          totalIncome += item.amount;
        } else if (item.type === "EXPENSE") {
          totalExpense += item.amount;
        }
      }
    }

    const totalNetBalance = carriedForwardBalance + totalIncome - totalExpense;

    const breakdown = currentMonthTransactions
      .filter((item) => item.type === "EXPENSE")
      .reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + item.amount;
        return acc;
      }, {});

    return NextResponse.json({
      success: true,
      monthlyBudget: user.monthlyBudget ?? null,
      summary: {
        carriedForwardBalance,
        totalIncome,
        totalExpense,
        totalNetBalance,
        balance: totalNetBalance,
      },
      transactions: currentMonthTransactions.map((item) => ({
        id: item.id,
        title: item.description || item.category,
        amount: item.amount,
        type: item.type,
        category: item.category,
        createdAt: item.createdAt,
      })),
      breakdown: Object.entries(breakdown).map(([category, amount]) => ({
        category,
        amount,
      })),
    });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const POST = async (request: Request) => {
  try {
    const authData = extractAndValidateAuth(request);
    if (!authData) {
      return NextResponse.json(
        { error: "Telegram Mini App data မှန်ကန်မှု မရှိပါ" },
        { status: 401 },
      );
    }

    const rateLimit = checkRateLimit(`tx:${authData.user.id}`, 30);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Request limit exceeded" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) } },
      );
    }

    const body = await request.json();
    const { userId: telegramId, amount, type, category, description } = body;

    if (!telegramId || !amount || !type) {
      return NextResponse.json(
        { error: "လိုအပ်သော အချက်အလက်များ မပြည့်စုံပါ" },
        { status: 400 },
      );
    }

    if (String(authData.user.id) !== String(telegramId)) {
      return NextResponse.json(
        { error: "Telegram ID မမှန်ကန်ပါ" },
        { status: 403 },
      );
    }

    if (type !== "EXPENSE" && type !== "INCOME") {
      return NextResponse.json(
        {
          error:
            "အမျိုးအစား မှားယွင်းနေပါသည်။ (EXPENSE သို့မဟုတ် INCOME သာ ဖြစ်ရမည်)",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        telegramId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "အသုံးပြုသူ ရှာမတွေ့ပါ",
        },
        { status: 404 },
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: Number(amount),
        type,
        category: category || "အခြား",
        description: description || null,
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions Error:", error);
    return NextResponse.json(
      { error: "စာရင်း သိမ်းဆည်းရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်" },
      { status: 500 },
    );
  }
};

export const PUT = async (request: Request) => {
  try {
    const authData = extractAndValidateAuth(request);
    if (!authData) {
      return NextResponse.json(
        { error: "Telegram Mini App data မှန်ကန်မှု မရှိပါ" },
        { status: 401 },
      );
    }

    const rateLimit = checkRateLimit(`tx:${authData.user.id}`, 30);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Request limit exceeded" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) } },
      );
    }

    const body = await request.json();
    const { id, title, amount, category, type } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (String(existingTransaction.user.telegramId) !== String(authData.user.id)) {
      return NextResponse.json(
        { error: "Telegram ID မမှန်ကန်ပါ" },
        { status: 403 },
      );
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        description: title,
        amount: Number(amount),
        category,
        type,
      },
    });

    return NextResponse.json({ success: true, data: updatedTransaction });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const authData = extractAndValidateAuth(request);
    if (!authData) {
      return NextResponse.json(
        { error: "Telegram Mini App data မှန်ကန်မှု မရှိပါ" },
        { status: 401 },
      );
    }

    const rateLimit = checkRateLimit(`tx:${authData.user.id}`, 30);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Request limit exceeded" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)) } },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (String(existingTransaction.user.telegramId) !== String(authData.user.id)) {
      return NextResponse.json(
        { error: "Telegram ID မမှန်ကန်ပါ" },
        { status: 403 },
      );
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
};
