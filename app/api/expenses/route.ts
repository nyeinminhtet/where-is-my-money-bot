import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get("telegramId");

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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // INCOME ရော EXPENSE ရော အကုန်ဆွဲယူမည် (Reversed မဖြစ်တာများ)
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        reversedAt: null,
        createdAt: {
          gte: startOfMonth, // Greater than or equal to 1st of this month
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Income, Expense, Balance စုစုပေါင်း တွက်ချက်ခြင်း
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((item) => {
      if (item.type === "INCOME") {
        totalIncome += item.amount;
      } else if (item.type === "EXPENSE") {
        totalExpense += item.amount;
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
      transactions: transactions.map((item) => ({
        id: item.id,
        title: item.description || item.category,
        amount: item.amount,
        type: item.type, // 'INCOME' or 'EXPENSE'
        category: item.category,
        createdAt: item.createdAt,
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
