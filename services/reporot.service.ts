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
      reversedAt: null,
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
      reversedAt: null,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      amount: true,
      type: true,
    },
  });

  return calculateSummary(transactions);
}

export async function getYearlyReport(userId: string, start: Date, end: Date) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      reversedAt: null,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      amount: true,
      type: true,
    },
  });

  return calculateSummary(transactions);
}
