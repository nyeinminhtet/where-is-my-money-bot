import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getChatId } from "@/lib/telegram/parser";
import { sendMessage } from "@/lib/telegram/client";
import { getBalanceDetails } from "@/services/balance.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { mainMenuKeyboard } from "@/utils/keyboard";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleBalance = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const { carriedForwardBalance, totalIncome, totalExpense, totalNetBalance } =
    await getBalanceDetails(user.id);

  const lang = userLanguage;

  const messageLines = [
    getTranslation(lang, "BALANCE_HEADER"),
    getTranslation(lang, "BALANCE_NET", { amount: formatCurrency(totalNetBalance) }),
  ];

  if (carriedForwardBalance !== 0) {
    messageLines.push(
      getTranslation(lang, "BALANCE_CARRIED_FORWARD", { amount: formatCurrency(carriedForwardBalance) }),
    );
  }

  messageLines.push(
    "",
    getTranslation(lang, "BALANCE_INCOME", { amount: formatCurrency(totalIncome) }),
    getTranslation(lang, "BALANCE_EXPENSE", { amount: formatCurrency(totalExpense) }),
  );

  const message = messageLines.join("\n");

  return sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: mainMenuKeyboard(lang),
  });
};
