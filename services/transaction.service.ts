import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

interface CreateTransactionInput {
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
}

export async function createTransaction(input: CreateTransactionInput) {
  return prisma.transaction.create({
    data: input,
  });
}

export async function getLatestTransaction(userId: string) {
  return prisma.transaction.findFirst({
    where: {
      userId,
      reversedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function undoLastTransaction(userId: string) {
  const latest = await getLatestTransaction(userId);

  if (!latest) {
    return null;
  }

  return prisma.transaction.update({
    where: {
      id: latest.id,
    },
    data: {
      reversedAt: new Date(),
    },
  });
}
