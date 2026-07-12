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

export async function deleteTransaction(transactioId: string, userId: string) {
  try {
    return await prisma.transaction.delete({
      where: {
        id: transactioId,
        userId,
      },
    });
  } catch {
    return null;
  }
}
