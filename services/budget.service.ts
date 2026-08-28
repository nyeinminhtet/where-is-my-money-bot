import { prisma } from "@/lib/prisma";
import { SessionState } from "@/generated/prisma/client";
import { updateSession } from "@/lib/session";

export const setBudget = async (userId: string, amount: number) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      monthlyBudget: amount,
    },
  });
};

export const updateBudgetSession = async (userId: string) => {
  return updateSession(userId, { currentState: SessionState.WAITING_BUDGET });
};
