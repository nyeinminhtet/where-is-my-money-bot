import { getChatId } from "@/lib/telegram/parser";
import { sendMessage } from "@/lib/telegram/client";
import type { TelegramUpdate } from "@/types/telegram";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleHelp = async (update: TelegramUpdate, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const message = getTranslation(userLanguage, "HELP_MESSAGE");
  await sendMessage(chatId, message);
};
