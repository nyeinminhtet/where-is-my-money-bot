import { TransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const getBalanceDetails = async (userId: string) => {
  const now = new Date();
  // လက်ရှိလ၏ ၁ ရက်နေ့ 00:00:00 ကို ရှာခြင်း
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. ယခင်လများမှ စုစုပေါင်း Income
  const prevIncome = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: TransactionType.INCOME,
      reversedAt: null,
      createdAt: { lt: startOfMonth },
    },
  });

  // 2. ယခင်လများမှ စုစုပေါင်း Expense
  const prevExpense = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: TransactionType.EXPENSE,
      reversedAt: null,
      createdAt: { lt: startOfMonth },
    },
  });

  // 3. ဒီလထဲမှ စုစုပေါင်း Income
  const currentIncome = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId,
      type: TransactionType.INCOME,
      reversedAt: null,
      createdAt: { gte: startOfMonth },
    },
  });

  // 4. ဒီလထဲမှ စုစုပေါင်း Expense
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
