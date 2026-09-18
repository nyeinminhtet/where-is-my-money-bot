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
import { getTranslation, type Locale } from "@/lib/i18n";

type UserWithBudget = {
  id: string;
  monthlyBudget?: number | null;
  language?: Locale;
};

export const handleBudgetInput = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const chatId = getChatId(update);
  const text = getMessageText(update);
  if (!chatId || !text) return;

  const lang = userLanguage;
  const budgetAmount = parseFloat(text.replace(/,/g, ""));
  if (isNaN(budgetAmount) || budgetAmount <= 0) {
    return sendMessage(
      chatId,
      getTranslation(lang, "AMOUNT_PROMPT"),
    );
  }

  await setBudget(user.id, budgetAmount);
  await updateState(user.id, SessionState.IDLE);

  return sendMessage(
    chatId,
    getTranslation(lang, "BUDGET_SET", { amount: formatCurrency(budgetAmount) }),
  );
};

export const askForBudget = async (update: TelegramUpdate, userId: string, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const lang = userLanguage;
  await updateBudgetSession(userId);
  return sendMessage(chatId, getTranslation(lang, "BUDGET_ASK"));
};

export const handleCheckBudget = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const lang = userLanguage;

  if (!user.monthlyBudget) {
    return sendMessage(chatId, getTranslation(lang, "BUDGET_NOT_SET"));
  }

  const totalExpense = await getTotalExpenseThisMonth(user.id);
  return sendMessage(
    chatId,
    getBudgetStatusMessage({ totalExpense, budget: user.monthlyBudget }, lang),
  );
};

export const checkAndSendBudgetWarning = async (
  user: UserWithBudget,
  chatId: number | string,
  userLanguage?: Locale,
) => {
  // Skip when the user has no budget configured.
  if (!user.monthlyBudget) return;

  const lang = userLanguage || "mm";
  const totalExpense = await getTotalExpenseThisMonth(user.id);
  const budget = user.monthlyBudget;

  // Only warn once the user has used 80% or more of their budget.
  if (totalExpense < budget * 0.8) return;
  if (!getBudgetWarningText({ totalExpense, budget })) return;

  await sendMessage(
    chatId,
    getBudgetWarningMessage({ totalExpense, budget }, lang),
    { parse_mode: "Markdown" },
  );
};
