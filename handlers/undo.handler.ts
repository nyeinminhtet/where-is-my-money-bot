import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { sendMessage } from "@/lib/telegram";

import { undoLastTransaction } from "@/services/transaction.service";

import { formatCurrency } from "@/utils/formatCurrency";

export async function handleUndo(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const transaction = await undoLastTransaction(user.id);

  if (!transaction) {
    return sendMessage(chatId, "Undo လုပ်ရန် Transaction မရှိပါ။");
  }

  const typeText = transaction.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";

  return sendMessage(
    chatId,
    [
      "↩️ Undo ပြီးပါပြီ။",
      "",
      `Type: ${typeText}`,
      `Category: ${transaction.category}`,
      `Amount: ${formatCurrency(transaction.amount)}`,
    ].join("\n"),
  );
}
