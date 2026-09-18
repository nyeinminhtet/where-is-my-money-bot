import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/telegram/parser";
import { deleteMessage, answerCallbackQuery } from "@/lib/telegram/client";
import { deleteTransaction } from "@/services/transaction.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTypeText } from "@/lib/helpers/transaction-summary";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleUndo = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
    const chatId = getChatId(update);
    const callbackQuery = update.callback_query;
    const callbackData = callbackQuery?.data;
    const messageId = callbackQuery?.message?.message_id;
    if (!chatId || !callbackData) return;

    const lang = userLanguage;

    // Legacy undo handler for entries created before the system migrated.
    if (callbackData === "UNDO_LAST") {
        if (callbackQuery?.id) {
            await answerCallbackQuery(
                callbackQuery.id,
                getTranslation(lang, "UNDO_LEGACY"),
                true,
            );
        }
        return;
    }

    const transactionId = callbackData.split("_")[1];

    // Delete the transaction from the database.
    const transaction = await deleteTransaction(transactionId, user.id);
    if (!transaction) {
        if (callbackQuery?.id) {
            await answerCallbackQuery(
                callbackQuery.id,
                getTranslation(lang, "UNDO_NOT_FOUND"),
                true,
            );
        }
        return;
    }

    // Remove the associated message from the Telegram chat.
    if (messageId) {
        try {
            await deleteMessage(chatId, messageId);
        } catch (error) {
            console.error("Delete message error:", error);
        }
    }

    // Notify the user with a toast/alert.
    const typeText = getTypeText(transaction.type);
    if (callbackQuery?.id) {
        await answerCallbackQuery(
            callbackQuery.id,
            getTranslation(lang, "UNDO_DELETED", {
                description: transaction.description || typeText,
                amount: formatCurrency(transaction.amount),
            }),
            false,
        );
    }
};
