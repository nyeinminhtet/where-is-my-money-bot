import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { SessionState } from "@/generated/prisma/client";

import { getChatId, getCallbackData } from "@/lib/parser";

import { updateTempCategory, updateState } from "@/lib/session";

import { sendMessage } from "@/lib/telegram";

export async function handleCategory(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const callbackData = getCallbackData(update);

  if (!callbackData) {
    return sendMessage(chatId, "Category ရွေးပါ။");
  }

  if (!callbackData.startsWith("CATEGORY_")) {
    return sendMessage(chatId, "Category မမှန်ပါ။");
  }

  const category = callbackData.replace("CATEGORY_", "");

  if (!category) {
    return sendMessage(chatId, "Category မမှန်ပါ။");
  }

  await updateTempCategory(user.id, category);

  await updateState(user.id, SessionState.WAITING_DESCRIPTION);

  return sendMessage(chatId, "အသေးစိတ်ဖော်ပြချက် ထည့်ပါ။");
}
