import { prisma } from "@/lib/prisma";

export const setBudget = async (userId: string, amount: number) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      monthlyBudget: amount,
    },
  });
};

export async function updateBudgetSession(userId: string) {
  return await prisma.botSession.update({
    where: { userId: userId },
    data: { currentState: "WAITING_BUDGET" },
  });
}
