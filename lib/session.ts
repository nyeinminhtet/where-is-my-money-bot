import { SessionState, TransactionType } from "@/generated/prisma/client";
import { prisma } from "./prisma";

export const getSession = async (userId: string) => {
    return prisma.botSession.findUnique({
        where: { userId },
    });
};

export const createSession = async (userId: string) => {
    return prisma.botSession.create({
        data: {
            userId,
            currentState: SessionState.IDLE,
        },
    });
};

export const getOrCreateSession = async (userId: string) => {
    const session = await getSession(userId);
    if (session) {
        return session;
    }
    return createSession(userId);
};

export const updateState = async (userId: string, state: SessionState) => {
    return prisma.botSession.update({
        where: {
            userId,
        },
        data: {
            currentState: state,
        },
    });
};

export const updateTempAmount = async (userId: string, amount: number) => {
    return prisma.botSession.update({
        where: {
            userId,
        },
        data: {
            tempAmount: amount,
        },
    });
};

export const updateTempType = async (userId: string, type: TransactionType) => {
    return prisma.botSession.update({
        where: {
            userId,
        },
        data: {
            tempType: type,
        },
    });
};

export const updateTempCategory = async (userId: string, category: string) => {
    return prisma.botSession.update({
        where: {
            userId,
        },
        data: {
            tempCategory: category,
        },
    });
};

export const setLastTransaction = async (userId: string, transactionId: string) => {
    return prisma.botSession.update({
        where: {
            userId,
        },
        data: {
            lastTransactionId: transactionId,
        },
    });
};

export const clearSession = async (userId: string) => {
    return prisma.botSession.update({
        where: {
            userId,
        },
        data: {
            currentState: SessionState.IDLE,
            tempAmount: null,
            tempType: null,
            tempCategory: null,
        },
    });
};
