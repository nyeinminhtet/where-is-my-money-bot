import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

function calculateSummary(
  transactions: {
    amount: number;
    type: TransactionType;
  }[],
) {
  let income = 0;
  let expense = 0;

  for (const transaction of transactions) {
    if (transaction.type === TransactionType.INCOME) {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export async function getSummary(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    select: {
      amount: true,
      type: true,
    },
  });

  return calculateSummary(transactions);
}

export async function getMonthlyReport(userId: string, start: Date, end: Date) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      createdAt: { gte: start, lte: end },
    },
  });

  const categoryExpenses = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      userId,
      type: "EXPENSE",
      createdAt: { gte: start, lte: end },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  const categoryIncomes = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      userId,
      type: "INCOME",
      createdAt: { gte: start, lte: end },
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
    categoryExpenses,
    categoryIncomes,
  };
}

export async function getYearlyReport(userId: string, start: Date, end: Date) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      amount: true,
      type: true,
      createdAt: true,
    },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.type === "INCOME") totalIncome += t.amount;
    else totalExpense += t.amount;
  }

  const monthlyBreakdown = Array.from({ length: 12 }, (_, index) => {
    const monthNum = index + 1;

    const monthTransactions = transactions.filter(
      (t) => new Date(t.createdAt).getMonth() === index,
    );

    let income = 0;
    let expense = 0;

    for (const t of monthTransactions) {
      if (t.type === "INCOME") income += t.amount;
      else expense += t.amount;
    }

    return {
      month: monthNum,
      income,
      expense,
      hasData: monthTransactions.length > 0,
    };
  });

  return {
    income: totalIncome,
    expense: totalExpense,
    balance: totalIncome - totalExpense,
    monthlyBreakdown,
  };
}

export async function getTodayReport(userId: string, start: Date, end: Date) {
  return await prisma.transaction.findMany({
    where: {
      userId: userId,
      createdAt: { gte: start, lte: end },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
