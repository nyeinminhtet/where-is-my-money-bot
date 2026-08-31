import { TransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const getBalanceDetails = async (userId: string) => {
  const now = new Date();
  // First day of the current month at 00:00:00.
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Total income from previous months.
  const prevIncome = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: TransactionType.INCOME,
      reversedAt: null,
      createdAt: { lt: startOfMonth },
    },
  });

  // 2. Total expense from previous months.
  const prevExpense = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: TransactionType.EXPENSE,
      reversedAt: null,
      createdAt: { lt: startOfMonth },
    },
  });

  // 3. Total income within the current month.
  const currentIncome = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: TransactionType.INCOME,
      reversedAt: null,
      createdAt: { gte: startOfMonth },
    },
  });

  // 4. Total expense within the current month.
  const currentExpense = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: TransactionType.EXPENSE,
      reversedAt: null,
      createdAt: { gte: startOfMonth },
    },
  });

  const carriedForwardBalance =
    (prevIncome._sum.amount ?? 0) - (prevExpense._sum.amount ?? 0);
  const totalIncome = currentIncome._sum.amount ?? 0;
  const totalExpense = currentExpense._sum.amount ?? 0;
  const totalNetBalance = carriedForwardBalance + totalIncome - totalExpense;

  return {
    carriedForwardBalance,
    totalIncome,
    totalExpense,
    totalNetBalance,
  };
};
