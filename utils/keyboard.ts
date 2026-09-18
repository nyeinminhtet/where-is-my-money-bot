import type {
  TelegramInlineKeyboardButton,
  TelegramInlineKeyboardMarkup,
  TelegramReplyKeyboardMarkup,
} from "@/types/telegram";
import { getTranslation, type Locale } from "@/lib/i18n";

export const typeKeyboard = (lang: Locale = "mm"): TelegramInlineKeyboardMarkup => {
    return {
        inline_keyboard: [
            [
                {
                    text: getTranslation(lang, "TYPE_INCOME"),
                    callback_data: "TYPE_INCOME",
                },
                {
                    text: getTranslation(lang, "TYPE_EXPENSE"),
                    callback_data: "TYPE_EXPENSE",
                },
            ],
        ],
    };
};

export const categoryKeyboard = (categories: string[]): TelegramInlineKeyboardMarkup => {
    const inlineKeyboard: TelegramInlineKeyboardButton[][] = [];
    const buttonsPerRow = 2;
    for (let i = 0; i < categories.length; i += buttonsPerRow) {
        const row = categories.slice(i, i + buttonsPerRow).map((category) => {
            const originalIndex = categories.indexOf(category);
            return {
                text: category,
                callback_data: `CATEGORY_${originalIndex}`,
            };
        });
        inlineKeyboard.push(row);
    }
    return {
        inline_keyboard: inlineKeyboard,
    };
};

export const undoKeyboard = (transactionId: string, lang: Locale = "mm"): TelegramInlineKeyboardMarkup => {
    return {
        inline_keyboard: [
            [{ text: getTranslation(lang, "UNDO_BUTTON"), callback_data: `UNDO_${transactionId}` }],
        ],
    };
};

export const backKeyboard = (): TelegramInlineKeyboardMarkup => {
    return {
        inline_keyboard: [
            [
                {
                    text: "⬅️ Back",
                    callback_data: "BACK",
                },
            ],
        ],
    };
};

export const mainMenuKeyboard = (lang: Locale = "mm"): TelegramReplyKeyboardMarkup => {
    return {
        keyboard: [
            [
                {
                    text: getTranslation(lang, "MENU_BALANCE"),
                },
                {
                    text: getTranslation(lang, "MENU_TODAY"),
                },
            ],
            [
                {
                    text: getTranslation(lang, "MENU_MONTHLY"),
                },
                {
                    text: getTranslation(lang, "MENU_PREVIOUS_MONTH"),
                },
            ],
            [
                {
                    text: getTranslation(lang, "MENU_SET_BUDGET"),
                },
                {
                    text: getTranslation(lang, "MENU_CHECK_BUDGET"),
                },
            ],
            [
                {
                    text: getTranslation(lang, "MENU_YEARLY"),
                },
            ],
        ],
        resize_keyboard: true,
        persistent_keyboard: true,
    };
};
