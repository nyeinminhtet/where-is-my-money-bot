import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { SessionState } from "@/generated/prisma/client";

import { getChatId, getCallbackData } from "@/lib/telegram/parser";

import { updateTempCategory, updateState, getSession } from "@/lib/session";

import { sendMessage } from "@/lib/telegram/client";
import { DEFAULT_CATEGORIES } from "@/constants/categories";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleCategory = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
    const chatId = getChatId(update);
    if (!chatId) return;

    const lang = userLanguage;
    const callbackData = getCallbackData(update);
    if (!callbackData) {
        return sendMessage(chatId, getTranslation(lang, "CATEGORY_PROMPT"));
    }

    if (!callbackData.startsWith("CATEGORY_")) {
        return sendMessage(chatId, getTranslation(lang, "CATEGORY_INVALID"));
    }

    const categoryIndex = Number(callbackData.replace("CATEGORY_", ""));
    if (Number.isNaN(categoryIndex)) {
        return sendMessage(chatId, getTranslation(lang, "CATEGORY_INVALID"));
    }

    const session = await getSession(user.id);
    if (!session?.tempType) {
        return sendMessage(chatId, getTranslation(lang, "CATEGORY_NO_TYPE"));
    }

    const categories = DEFAULT_CATEGORIES[session.tempType];
    const category = categories[categoryIndex];
    if (!category) {
        return sendMessage(chatId, getTranslation(lang, "CATEGORY_INVALID"));
    }

    await updateTempCategory(user.id, category);
    await updateState(user.id, SessionState.WAITING_DESCRIPTION);

    return sendMessage(chatId, getTranslation(lang, "DESCRIPTION_PROMPT"), {
        reply_markup: {
            inline_keyboard: [
                [{ text: getTranslation(lang, "DESCRIPTION_SKIP"), callback_data: "DESCRIPTION_SKIP" }],
            ],
        },
    });
};
