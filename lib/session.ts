import { SessionState, TransactionType } from "@/generated/prisma/client";
import { prisma } from "./prisma";

export async function getSession(userId: string) {
  return prisma.botSession.findUnique({
    where: { userId },
  });
}

export async function createSession(userId: string) {
  return prisma.botSession.create({
    data: {
      userId,
      currentState: SessionState.IDLE,
    },
  });
}

export async function getOrCreateSession(userId: string) {
  const session = await getSession(userId);

  if (session) {
    return session;
  }

  return createSession(userId);
}

export async function updateState(userId: string, state: SessionState) {
  return prisma.botSession.update({
    where: {
      userId,
    },
    data: {
      currentState: state,
    },
  });
}

export async function updateTempAmount(userId: string, amount: number) {
  return prisma.botSession.update({
    where: {
      userId,
    },
    data: {
      tempAmount: amount,
    },
  });
}

export async function updateTempType(userId: string, type: TransactionType) {
  return prisma.botSession.update({
    where: {
      userId,
    },
    data: {
      tempType: type,
    },
  });
}

export async function updateTempCategory(userId: string, category: string) {
  return prisma.botSession.update({
    where: {
      userId,
    },
    data: {
      tempCategory: category,
    },
  });
}

export async function setLastTransaction(
  userId: string,
  transactionId: string,
) {
  return prisma.botSession.update({
    where: {
      userId,
    },
    data: {
      lastTransactionId: transactionId,
    },
  });
}

export async function clearSession(userId: string) {
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
}
