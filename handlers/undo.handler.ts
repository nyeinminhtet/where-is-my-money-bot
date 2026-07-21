// 📂 handlers/undo.handler.ts

import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";
import { deleteMessage, answerCallbackQuery } from "@/lib/telegram";
import { deleteTransaction } from "@/services/transaction.service";
import { formatCurrency } from "@/utils/formatCurrency";

export async function handleUndo(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);
  const callbackQuery = update.callback_query;
  const callbackData = callbackQuery?.data;
  const messageId = callbackQuery?.message?.message_id;

  if (!chatId || !callbackData) return;

  // 1. စနစ်ဟောင်း အကြောင်းကြားစာ
  if (callbackData === "UNDO_LAST") {
    if (callbackQuery?.id) {
      await answerCallbackQuery(
        callbackQuery.id,
        "⚠️ ဒီစာရင်းက စနစ်မပြောင်းခင်က စာရင်းအဟောင်းဖြစ်တဲ့အတွက် Bot ထဲကနေ လှမ်းဖျက်လို့ မရတော့ပါ။",
        true, // Popup Modal အနေနဲ့ ပြမည်
      );
    }
    return;
  }

  const transactionId = callbackData.split("_")[1];

  // 2. DB ထဲမှ Transaction ကို Delete လုပ်မည်
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

  // 3. ✨ Telegram Chat ထဲမှ Message ကို ဖျက်ထုတ်မည်
  if (messageId) {
    try {
      await deleteMessage(chatId, messageId);
    } catch (error) {
      console.error("❌ Delete message error:", error);
    }
  }

  // 4. ✨ User ဆီ Toast Notification / Alert အနေနဲ့ ပြသပေးမည်
  const typeText = transaction.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";
  if (callbackQuery?.id) {
    await answerCallbackQuery(
      callbackQuery.id,
      `🗑️ ${transaction.description || typeText} (${formatCurrency(transaction.amount)}) စာရင်းဖျက်လိုက်ပါပြီ!`,
      false,
    );
  }
}
