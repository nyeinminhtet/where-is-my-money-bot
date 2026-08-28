import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { MYANMAR_OFFSET_MS } from "@/utils/date";

const DAILY_AI_USAGE_LIMIT = 10;

export const checkAndUpdateAiQuota = async (
  userId: string,
  userTelegramId: string,
  userRole: string,
) => {
  const adminTelegramId = env.telegram.adminId;

  if (
    userRole === "ADMIN" ||
    (adminTelegramId && userTelegramId.toString() === adminTelegramId)
  ) {
    return {
      allowed: true,
      remaining: 99999,
    };
  }

  // 2. Get today's date in Myanmar Standard Time (UTC+6:30)
  const now = new Date();
  const mmTime = new Date(now.getTime() + MYANMAR_OFFSET_MS);
  const todayStr = mmTime.toISOString().split("T")[0];

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, remaining: 0 };

  // 3. Reset the daily count when the last usage was on a previous day.

  let currentCount = user.aiUsageCount;

  if (user.lastAiUsageDate) {
    const lastUsageStr = new Date(
      user.lastAiUsageDate.getTime() + MYANMAR_OFFSET_MS,
    )
      .toISOString()
      .split("T")[0];

    if (lastUsageStr !== todayStr) {
      currentCount = 0;
    }
  }

  // 4. Reject once the daily limit is reached.
  if (currentCount >= DAILY_AI_USAGE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  // 5. Increment the count and persist it.
  const updatedCount = currentCount + 1;
  await prisma.user.update({
    where: { id: userId },
    data: {
      aiUsageCount: updatedCount,
      lastAiUsageDate: new Date(),
    },
  });

  return { allowed: true, remaining: DAILY_AI_USAGE_LIMIT - updatedCount };
};
