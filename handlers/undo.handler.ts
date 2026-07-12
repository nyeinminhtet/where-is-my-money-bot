import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { sendMessage } from "@/lib/telegram";

import { deleteTransaction } from "@/services/transaction.service";

import { formatCurrency } from "@/utils/formatCurrency";

export async function handleUndo(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);
  const callbackData = update.callback_query?.data;

  if (!chatId || !callbackData) return;

  if (callbackData === "UNDO_LAST") {
    const chatId =
      update.message?.chat.id ?? update.callback_query?.message?.chat.id;
    if (chatId) {
      return sendMessage(
        chatId,
        "⚠️ ဒီစာရင်းက စနစ်မပြောင်းခင်က စာရင်းအဟောင်းဖြစ်တဲ့အတွက် Bot ထဲကနေ လှမ်းဖျက်လို့ မရတော့ပါ။",
      );
    }
    return;
  }

  const transactionId = callbackData.split("_")[1];

  const transaction = await deleteTransaction(transactionId, user.id);

  if (!transaction) {
    return sendMessage(
      chatId,
      "⚠️ ဒီစာရင်းက ဖျက်ပြီးသား ဖြစ်နေလို့ ထပ်ဖျက်လို့ မရတော့ပါ။",
    );
  }

  const typeText = transaction.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";

  return sendMessage(
    chatId,
    [
      "↩️ စာရင်းဖျက်ပြီးပါပြီ (Undo)",
      "",
      `📌 အမျိုးအစား - ${typeText}`,
      `📂 ကဏ္ဍ - ${transaction.category}`,
      `💰 ပမာဏ - ${formatCurrency(transaction.amount)}`,
    ].join("\n"),
  );
}
