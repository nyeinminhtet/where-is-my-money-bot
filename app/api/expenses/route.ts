import { getMonthDateRange } from "@/lib/helpers/summary";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get("telegramId");
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
