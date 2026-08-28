import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/telegram/parser";
import { deleteMessage, answerCallbackQuery } from "@/lib/telegram/client";
import { deleteTransaction } from "@/services/transaction.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTypeText } from "@/lib/helpers/transaction-summary";

export const handleUndo = async (update: TelegramUpdate, user: User) => {
    const chatId = getChatId(update);
    const callbackQuery = update.callback_query;
    const callbackData = callbackQuery?.data;
    const messageId = callbackQuery?.message?.message_id;
    if (!chatId || !callbackData) return;

    // Legacy undo handler for entries created before the system migrated.
    if (callbackData === "UNDO_LAST") {
        if (callbackQuery?.id) {
            await answerCallbackQuery(
                callbackQuery.id,
                "⚠️ ဒီစာရင်းက စနစ်မပြောင်းခင်က စာရင်းအဟောင်းဖြစ်တဲ့အတွက် Bot ထဲကနေ လှမ်းဖျက်လို့ မရတော့ပါ။",
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
                "⚠️ ဒီစာရင်းက ဖျက်ပြီးသား ဖြစ်နေပါသည် (သို့မဟုတ် မရှိတော့ပါ)၊",
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
            `🗑️ ${transaction.description || typeText} (${formatCurrency(transaction.amount)}) စာရင်းဖျက်လိုက်ပါပြီ!`,
            false,
        );
    }
};
