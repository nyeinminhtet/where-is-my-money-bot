import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getChatId, getMessageText } from "@/lib/telegram/parser";

import { clearSession, getSession } from "@/lib/session";

import { sendMessage } from "@/lib/telegram/client";

import { createTransaction } from "@/services/transaction.service";

import { undoKeyboard } from "@/utils/keyboard";
import { getBalanceDetails } from "@/services/balance.service";
import { buildTransactionSummaryMessage } from "@/lib/helpers/transaction-summary";
import { checkAndSendBudgetWarning } from "./budget.handler";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleDescription = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const lang = userLanguage;
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
      getTranslation(lang, "SESSION_INCOMPLETE"),
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

  const { totalNetBalance, carriedForwardBalance } = await getBalanceDetails(
    user.id,
  );

  const message = buildTransactionSummaryMessage(transaction, {
    header: getTranslation(lang, "TX_SAVED"),
    includeBalance: totalNetBalance,
    carriedForwardBalance,
  });

  await sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: undoKeyboard(transaction.id, lang),
  });

  if (transaction.type === "EXPENSE") {
    await checkAndSendBudgetWarning(
      { id: user.id, monthlyBudget: user.monthlyBudget },
      chatId,
      lang,
    );
  }
};
