import { prisma } from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma/client";

interface CreateTransactionInput {
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
}

export const createTransaction = async (input: CreateTransactionInput) => {
    return prisma.transaction.create({
        data: input,
    });
};

export const getLatestTransaction = async (userId: string) => {
    return prisma.transaction.findFirst({
        where: {
            userId,
            reversedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const deleteTransaction = async (transactioId: string, userId: string) => {
    try {
        return await prisma.transaction.delete({
            where: {
                id: transactioId,
                userId,
            },
        });
    }
    catch {
        return null;
    }
};

export const getTotalExpenseThisMonth = async (userId: string) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const aggregate = await prisma.transaction.aggregate({
        where: {
            userId: userId,
            type: TransactionType.EXPENSE, // မင်းရဲ့ TransactionType enum အတိုင်း ထည့်ပါ
            createdAt: {
                gte: start,
                lte: end,
            },
        },
        _sum: {
            amount: true,
        },
    });
    return aggregate._sum.amount || 0;
};
