import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

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

  // 2. မြန်မာစံတော်ချိန် (UTC+6:30) ဖြင့် ဒီနေ့ ရက်စွဲယူမည်
  const now = new Date();
  const mmTime = new Date(now.getTime() + 6.5 * 60 * 60 * 1000);
  const todayStr = mmTime.toISOString().split("T")[0];
  const todayMidnight = new Date(`${todayStr}T00:00:00.000Z`);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { allowed: false, remaining: 0 };

  // 3. ရက်ပြောင်းသွားပါက (lastAiUsageDate က ဒီနေ့ထက် စောနေပါက) Count ကို 0 ပြန်စဖြုတ်မည်

  let currentCount = user.aiUsageCount;

  if (user.lastAiUsageDate) {
    const lastUsageStr = new Date(
      user.lastAiUsageDate.getTime() + 6.5 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];

    if (lastUsageStr !== todayStr) {
      currentCount = 0;
    }
  }

  // 4. Limit ပြည့်သွားပါက Reject လုပ်မည်
  if (currentCount >= DAILY_AI_USAGE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  // 5. Limit မပြည့်သေးပါက Count +1 တိုးပြီး DB တွင် အပ်ဒိတ်လုပ်မည်
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
