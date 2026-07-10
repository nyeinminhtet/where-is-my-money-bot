import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId, getMessageText } from "@/lib/parser";

import { getSession, clearSession } from "@/lib/session";

import { sendMessage } from "@/lib/telegram";

import { createTransaction } from "@/services/transaction.service";

import { undoKeyboard } from "@/utils/keyboard";

import { formatCurrency } from "@/utils/formatCurrency";

export async function handleDescription(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const description = getMessageText(update).trim();

  if (!description) {
    return sendMessage(chatId, "ဖော်ပြချက် ထည့်ပေးပါ။");
  }

  const session = await getSession(user.id);

  if (
    !session ||
    !session.tempAmount ||
    !session.tempType ||
    !session.tempCategory
  ) {
    return sendMessage(
      chatId,
      "Transaction data မပြည့်စုံပါ။ ထပ်မံကြိုးစားပါ။",
    );
  }

  const transaction = await createTransaction({
    userId: user.id,
    amount: session.tempAmount,
    type: session.tempType,
    category: session.tempCategory,
    description,
  });

  await clearSession(user.id);

  const typeText = transaction.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";

  return sendMessage(
    chatId,
    [
      "✅ Transaction သိမ်းပြီးပါပြီ။",
      "",
      `Type: ${typeText}`,
      `Category: ${transaction.category}`,
      `Amount: ${formatCurrency(transaction.amount)}`,
      `Description: ${transaction.description}`,
    ].join("\n"),
    {
      reply_markup: undoKeyboard(),
    },
  );
}
