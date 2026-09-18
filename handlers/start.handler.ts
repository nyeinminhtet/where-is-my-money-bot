import { getChatId } from "@/lib/telegram/parser";
import { sendMessage } from "@/lib/telegram/client";
import { mainMenuKeyboard } from "@/utils/keyboard";
import type { TelegramUpdate } from "@/types/telegram";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleStart = async (update: TelegramUpdate, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const firstName = update.message?.from?.first_name || "User";
  const message = getTranslation(userLanguage, "START_WELCOME", { name: firstName });

  await sendMessage(chatId, message, {
    reply_markup: mainMenuKeyboard(userLanguage),
  });
};
