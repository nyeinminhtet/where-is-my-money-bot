import type { TelegramUpdate } from "@/types/telegram";
import { SessionState, type User } from "@/generated/prisma/client";
import { getChatId, getMessageText } from "@/lib/parser";
import { sendMessage } from "@/lib/telegram";
import { formatCurrency } from "@/utils/formatCurrency";
import { updateBudgetSession, setBudget } from "@/services/budget.service";
import { updateState } from "@/lib/session";
import { getTotalExpenseThisMonth } from "@/services/transaction.service";

export async function handleBudgetInput(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);
  const text = getMessageText(update);
  if (!chatId || !text) return;

  const budgetAmount = parseFloat(text.replace(/,/g, ""));
  if (isNaN(budgetAmount) || budgetAmount <= 0) {
    return sendMessage(
      chatId,
      "❌ ကျေးဇူးပြု၍ မှန်ကန်သော ပမာဏကို ဂဏန်းအမှန်ဖြင့်သာ ပြန်လည်ရိုက်ထည့်ပေးပါ။",
    );
  }

  await setBudget(user.id, budgetAmount);

  await updateState(user.id, SessionState.IDLE);

  return sendMessage(
    chatId,
    `✅ ယခုလအတွက် လစဉ် အသုံးစရိတ်ကို **${formatCurrency(budgetAmount)}** အဖြစ် သတ်မှတ်ပေးလိုက်ပါပြီ။ 💪`,
  );
}

export async function askForBudget(update: TelegramUpdate, userId: string) {
  const chatId = getChatId(update);
  if (!chatId) return;

  // ဒီနေရာမှာ User ရဲ့ State ကို DB ထဲမှာ 'AWAITING_BUDGET' လို့ သွားပြောင်းထားရမယ် ဆရာသမား
  await updateBudgetSession(userId);

  return sendMessage(
    chatId,
    "💰 ကျေးဇူးပြု၍ သင်သတ်မှတ်လိုသော လစဉ် Budget ပမာဏကို ဂဏန်းသီးသန့်ဖြင့် ရိုက်ထည့်ပေးပါ (ဥပမာ- 300000)။",
  );
}

export async function handleCheckBudget(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);
  if (!chatId) return;

  if (!user.monthlyBudget) {
    return sendMessage(
      chatId,
      "⚠️ လစဉ် အသုံးစရိတ် မသတ်မှတ်ရသေးပါ။\n⚙️ 'အသုံးစရိတ် သတ်မှတ်ရန်' ခလုတ်ကို နှိပ်ပြီး အရင်သတ်မှတ်ပေးပါ။",
    );
  }

  // ၂။ ဒီလသုံးထားသမျှနဲ့ ရာခိုင်နှုန်းကို တွက်ချက်မယ်
  const totalExpense = await getTotalExpenseThisMonth(user.id);
  const budget = user.monthlyBudget;
  const percentageUsed = ((totalExpense / budget) * 100).toFixed(1);
  const remainingBudget = budget - totalExpense;

  const budgetMessage = [
    `📊 **သင်၏ လစဉ် အသုံးစရိတ် အခြေအနေ**`,
    "---------------------------------",
    `💰 သတ်မှတ်ထားသော အသုံးစရိတ်  : ${formatCurrency(budget)}`,
    `📉 အသုံးပြုပြီးသမျှ : ${formatCurrency(totalExpense)} (${percentageUsed}%)`,
    `💵 ကျန်ရှိငွေ        : ${formatCurrency(remainingBudget >= 0 ? remainingBudget : 0)}`,
  ].join("\n");

  // ၄။ Budget ကျော်နေရင် Warning စာသားပါ တစ်ခါတည်း တွဲပြမယ်ဗျာ
  let finalMessage = budgetMessage;
  if (totalExpense >= budget) {
    finalMessage +=
      "\n\n🚨 **သတိပေးချက်:** ဒီလအတွက် သတ်မှတ်ထားတဲ့ အသုံးစရိတ် ပြည့်/ကျော်သွားပါပြီခင်ဗျာ! 📉";
  } else if (totalExpense >= budget * 0.8) {
    finalMessage +=
      "\n\n⚠️ **သတိပေးချက်:** ဒီလ အသုံးစရိတ် ရဲ့ 80% ကျော်သွားပါပြီ။ သတိထားသုံးစွဲပေးပါဦး။";
  }

  return sendMessage(chatId, finalMessage);
}
