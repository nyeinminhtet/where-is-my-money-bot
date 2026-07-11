import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { SessionState } from "@/generated/prisma/client";

import { sendMessage } from "@/lib/telegram";
import { getChatId } from "@/lib/parser";
import { updateState } from "@/lib/session";
import { mainMenuKeyboard } from "@/utils/keyboard";

export async function handleStart(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  await updateState(user.id, SessionState.IDLE);

  await sendMessage(
    chatId,
    `👋 မင်္ဂလာပါ ${user.firstName ?? ""}

  Where Is My Money Bot မှ ကြိုဆိုပါတယ်။

  ငွေပမာဏ ရိုက်ထည့်ပြီး
  ဝင်ငွေ / ထွက်ငွေ ကို စတင်မှတ်တမ်းတင်နိုင်ပါတယ်။

  ဥပမာ - 50000`,
    {
      reply_markup: mainMenuKeyboard(),
    },
  );
}
