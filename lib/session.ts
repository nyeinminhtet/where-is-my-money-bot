import { type Prisma, SessionState, TransactionType } from "@/generated/prisma/client";
import { prisma } from "./prisma";

type SessionUpdateData = Prisma.BotSessionUpdateInput;

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

// Generic session field updater used by all granular mutators below.
export const updateSession = async (userId: string, data: SessionUpdateData) => {
    return prisma.botSession.update({
        where: { userId },
        data,
    });
};

export const updateState = async (userId: string, state: SessionState) => {
    return updateSession(userId, { currentState: state });
};

export const updateTempAmount = async (userId: string, amount: number) => {
    return updateSession(userId, { tempAmount: amount });
};

export const updateTempType = async (userId: string, type: TransactionType) => {
    return updateSession(userId, { tempType: type });
};

export const updateTempCategory = async (userId: string, category: string) => {
    return updateSession(userId, { tempCategory: category });
};

export const setLastTransaction = async (userId: string, transactionId: string) => {
    return updateSession(userId, { lastTransactionId: transactionId });
};

export const clearSession = async (userId: string) => {
    return updateSession(userId, {
        currentState: SessionState.IDLE,
        tempAmount: null,
        tempType: null,
        tempCategory: null,
    });
};
