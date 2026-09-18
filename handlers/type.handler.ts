import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { SessionState, TransactionType } from "@/generated/prisma/client";

import { getChatId, getCallbackData } from "@/lib/telegram/parser";

import { updateTempType, updateState } from "@/lib/session";

import { sendMessage } from "@/lib/telegram/client";

import { categoryKeyboard } from "@/utils/keyboard";

import { DEFAULT_CATEGORIES } from "@/constants/categories";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleType = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
    const chatId = getChatId(update);
    if (!chatId) return;

    const lang = userLanguage;
    const callbackData = getCallbackData(update);
    if (!callbackData) {
        return sendMessage(chatId, getTranslation(lang, "TYPE_PROMPT"));
    }

    let type: TransactionType | null = null;
    switch (callbackData) {
        case "TYPE_INCOME":
            type = TransactionType.INCOME;
            break;
        case "TYPE_EXPENSE":
            type = TransactionType.EXPENSE;
            break;
    }

    if (!type) {
        return sendMessage(chatId, getTranslation(lang, "TYPE_INVALID"));
    }

    await updateTempType(user.id, type);
    await updateState(user.id, SessionState.WAITING_CATEGORY);

    return sendMessage(chatId, getTranslation(lang, "CATEGORY_PROMPT"), {
        reply_markup: categoryKeyboard(DEFAULT_CATEGORIES[type]),
    });
};
