import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { sendMessage } from "@/lib/telegram/client";
import { getChatId } from "@/lib/telegram/parser";
import { prisma } from "@/lib/prisma";
import { getTranslation, type Locale } from "@/lib/i18n";
import { mainMenuKeyboard } from "@/utils/keyboard";

const languageKeyboard = () => ({
  inline_keyboard: [
    [
      { text: "🇲🇲 မြန်မာ", callback_data: "LANG_mm" },
      { text: "🇬🇧 English", callback_data: "LANG_en" },
    ],
  ],
});

export const handleLanguage = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const lang = (user.language as Locale) || "mm";
  const message = getTranslation(lang, "LANGUAGE_PROMPT");
  await sendMessage(chatId, message, {
    reply_markup: languageKeyboard(),
  });
};

export const handleLanguageCallback = async (
  update: TelegramUpdate,
  user: User,
) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const callbackData = update.callback_query?.data;
  if (!callbackData?.startsWith("LANG_")) return;

  const newLang = callbackData.replace("LANG_", "") as Locale;
  if (newLang !== "en" && newLang !== "mm") return;

  await prisma.user.update({
    where: { id: user.id },
    data: { language: newLang },
  });

  const message = getTranslation(
    newLang,
    newLang === "en" ? "LANGUAGE_CHANGED_EN" : "LANGUAGE_CHANGED_MM",
  );
  await sendMessage(chatId, message, {
    reply_markup: mainMenuKeyboard(newLang),
  });
};
