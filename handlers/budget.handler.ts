import type { TelegramUpdate } from "@/types/telegram";
import { SessionState, type User } from "@/generated/prisma/client";
import { getChatId, getMessageText } from "@/lib/telegram/parser";
import { sendMessage } from "@/lib/telegram/client";
import { formatCurrency } from "@/utils/formatCurrency";
import { updateBudgetSession, setBudget } from "@/services/budget.service";
import { updateState } from "@/lib/session";
import { getTotalExpenseThisMonth } from "@/services/transaction.service";
import {
  getBudgetStatusMessage,
  getBudgetWarningMessage,
  getBudgetWarningText,
} from "@/lib/helpers/budget";

type UserWithBudget = {
  id: string;
  monthlyBudget?: number | null;
};

export const handleBudgetInput = async (update: TelegramUpdate, user: User) => {
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
};

export const askForBudget = async (update: TelegramUpdate, userId: string) => {
  const chatId = getChatId(update);
  if (!chatId) return;
  await updateBudgetSession(userId);
  return sendMessage(
    chatId,
    "💰 ကျေးဇူးပြု၍ သင်သတ်မှတ်လိုသော လစဉ် Budget ပမာဏကို ဂဏန်းသီးသန့်ဖြင့် ရိုက်ထည့်ပေးပါ (ဥပမာ- 300000)။",
  );
};

export const handleCheckBudget = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;
  if (!user.monthlyBudget) {
    return sendMessage(
      chatId,
      "⚠️ လစဉ် အသုံးစရိတ် မသတ်မှတ်ရသေးပါ။\n⚙️ 'အသုံးစရိတ် သတ်မှတ်ရန်' ခလုတ်ကို နှိပ်ပြီး အရင်သတ်မှတ်ပေးပါ။",
    );
  }
  const totalExpense = await getTotalExpenseThisMonth(user.id);
  return sendMessage(
    chatId,
    getBudgetStatusMessage({ totalExpense, budget: user.monthlyBudget }),
  );
};

export const checkAndSendBudgetWarning = async (
  user: UserWithBudget,
  chatId: number | string,
) => {
  // Skip when the user has no budget configured.
  if (!user.monthlyBudget) return;

  const totalExpense = await getTotalExpenseThisMonth(user.id);
  const budget = user.monthlyBudget;

  // Only warn once the user has used 80% or more of their budget.
  if (totalExpense < budget * 0.8) return;
  if (!getBudgetWarningText({ totalExpense, budget })) return;

  await sendMessage(
    chatId,
    getBudgetWarningMessage({ totalExpense, budget }),
    { parse_mode: "Markdown" },
  );
};
