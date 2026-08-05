import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getChatId, getMessageText } from "@/lib/parser";

import { clearSession, getSession } from "@/lib/session";

import { sendMessage } from "@/lib/telegram";

import { createTransaction } from "@/services/transaction.service";

import { formatCurrency } from "@/utils/formatCurrency";
import { undoKeyboard } from "@/utils/keyboard";
// 1. getBalance အစား getBalanceDetails ကို ပြောင်း import လုပ်ပါမည်
import { getBalanceDetails } from "@/services/balance.service";
import { checkAndSendBudgetWarning } from "./budget.handler";

export const handleDescription = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;
  const description = getMessageText(update).trim();

  const session = await getSession(user.id);
  if (
    !session ||
    !session.tempAmount ||
    !session.tempType ||
    !session.tempCategory
  ) {
    return sendMessage(
      chatId,
      "ငွေစာရင်းအချက်အလက် မပြည့်စုံပါ။ ထပ်မံကြိုးစားပါ။",
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

  // 2. getBalanceDetails ကို ခေါ်ယူပြီး Destructure လုပ်ပါမည်
  const { totalNetBalance, carriedForwardBalance } = await getBalanceDetails(
    user.id,
  );

  const typeText = transaction.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";
  const descriptionText = transaction.description
    ? transaction.description
    : "မရှိပါ";

  // Message Lines Dynamic ဆောက်ခြင်း
  const responseLines = [
    "✅ **စာရင်းသွင်းပြီးပါပြီ။**",
    "",
    `📌 အမျိုးအစား - ${typeText}`,
    `📂 ကဏ္ဍ - ${transaction.category}`,
    `💰 ပမာဏ - ${formatCurrency(transaction.amount)}`,
    `📝 မှတ်ချက် - ${descriptionText}`,
    "",
    `💵 **လက်ကျန်ငွေ - ${formatCurrency(totalNetBalance)}**`,
  ];

  // ယခင်လမှ ကျန်ငွေ ရှိနေရင် Indicator လေး ပါအောင် ထည့်ပေးမည်
  if (carriedForwardBalance !== 0) {
    responseLines.push(
      `*(ယခင်လများမှ ကျန်ငွေ: ${formatCurrency(carriedForwardBalance)})*`,
    );
  }

  await sendMessage(chatId, responseLines.join("\n"), {
    parse_mode: "Markdown",
    reply_markup: undoKeyboard(transaction.id),
  });

  if (transaction.type === "EXPENSE") {
    await checkAndSendBudgetWarning(
      { id: user.id, monthlyBudget: user.monthlyBudget },
      chatId,
    );
  }
};
