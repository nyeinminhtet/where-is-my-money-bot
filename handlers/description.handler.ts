import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId, getMessageText } from "@/lib/parser";

import { getSession, clearSession } from "@/lib/session";

import { sendMessage } from "@/lib/telegram";

import {
  createTransaction,
  getTotalExpenseThisMonth,
} from "@/services/transaction.service";

import { undoKeyboard } from "@/utils/keyboard";

import { formatCurrency } from "@/utils/formatCurrency";
import { getBalance } from "@/services/balance.service";

export async function handleDescription(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const description = getMessageText(update).trim();

  // if (!description) {
  //   return sendMessage(chatId, "ဖော်ပြချက် ထည့်ပေးပါ။");
  // }

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

  const currentBalance = await getBalance(user.id);

  const typeText = transaction.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";

  const descriptionText = transaction.description
    ? transaction.description
    : "မရှိပါ";

  sendMessage(
    chatId,
    [
      "✅ စာရင်းသွင်းပြီးပါပြီ။",
      "",
      `📌 အမျိုးအစား - ${typeText}`,
      `📂 ကဏ္ဍ - ${transaction.category}`,
      `💰 ပမာဏ - ${formatCurrency(transaction.amount)}`,
      `📝 မှတ်ချက် - ${descriptionText}`,
      "",
      `💵 လက်ကျန်ငွေ - ${formatCurrency(currentBalance)}`, // ✨ ဒီမှာ တွဲပြလိုက်တာ ကွက်တိပဲ!
    ].join("\n"),
    {
      reply_markup: undoKeyboard(transaction.id),
    },
  );

  if (transaction.type === "EXPENSE" && user.monthlyBudget) {
    const totalExpense = await getTotalExpenseThisMonth(user.id);
    const budget = user.monthlyBudget;
    const percentageUsed = ((totalExpense / budget) * 100).toFixed(1);

    let budgetMessage = [
      `📊 **လစဉ် Budget အခြေအနေ:**`,
      `- သုံးပြီးသမျှ: ${formatCurrency(totalExpense)} / ${formatCurrency(budget)} (${percentageUsed}%)`,
    ].join("\n");

    if (totalExpense >= budget) {
      budgetMessage +=
        "\n\n🚨 **သတိပေးချက်:** ဒီလအတွက် သတ်မှတ်ထားတဲ့ Budget ပြည့်/ကျော်သွားပါပြီ။ 📉";
    } else if (totalExpense >= budget * 0.8) {
      budgetMessage +=
        "\n\n⚠️ **သတိပေးချက်:** ဒီလ Budget ရဲ့ 80% ကျော်သွားပါပြီ။ သတိထားသုံးစွဲပေးပါဦး။";
    }

    // စက္ကန့်ပိုင်းလေး ခြားပြီး ဒုတိယ Message အဖြစ် ပို့လိုက်တာပေါ့ ဆရာသမား
    await sendMessage(chatId, budgetMessage);
  }
}
