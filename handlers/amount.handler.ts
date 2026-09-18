import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { SessionState } from "@/generated/prisma/client";

import { getChatId, getMessageText } from "@/lib/telegram/parser";
import { updateTempAmount, updateState } from "@/lib/session";

import { sendMessage } from "@/lib/telegram/client";

import { parseMyanmarNumber } from "@/utils/myanmarNumber";
import { typeKeyboard } from "@/utils/keyboard";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleAmount = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
    const chatId = getChatId(update);
    if (!chatId) return;

    const lang = userLanguage;
    const amount = parseMyanmarNumber(getMessageText(update));
    if (!amount || amount <= 0) {
        return sendMessage(chatId, getTranslation(lang, "AMOUNT_PROMPT"));
    }

    await updateTempAmount(user.id, amount);
    await updateState(user.id, SessionState.WAITING_TYPE);

    return sendMessage(chatId, getTranslation(lang, "TYPE_PROMPT"), {
        reply_markup: typeKeyboard(lang),
    });
};
