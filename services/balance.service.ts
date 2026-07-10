import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

export async function getBalance(userId: string) {
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

  return transactions.reduce((balance, transaction) => {
    if (transaction.type === TransactionType.INCOME) {
      return balance + transaction.amount;
    }

    return balance - transaction.amount;
  }, 0);
}
