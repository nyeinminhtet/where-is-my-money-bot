import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { SessionState } from "@/generated/prisma/client";

import { getChatId, getMessageText } from "@/lib/parser";
import { updateTempAmount, updateState } from "@/lib/session";

import { sendMessage } from "@/lib/telegram";

import { parseMyanmarNumber } from "@/utils/myanmarNumber";
import { typeKeyboard } from "@/utils/keyboard";

export async function handleAmount(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const amount = parseMyanmarNumber(getMessageText(update));

  if (!amount || amount <= 0) {
    return sendMessage(chatId, "ကျေးဇူးပြု၍ မှန်ကန်သော ငွေပမာဏ ထည့်ပါ။");
  }

  await updateTempAmount(user.id, amount);

  await updateState(user.id, SessionState.WAITING_TYPE);

  return sendMessage(chatId, "ဝင်ငွေ / ထွက်ငွေ ရွေးပါ။", {
    reply_markup: typeKeyboard(),
  });
}
