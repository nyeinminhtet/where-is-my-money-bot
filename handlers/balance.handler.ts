import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getChatId } from "@/lib/telegram/parser";
import { sendMessage } from "@/lib/telegram/client";
import { getBalanceDetails } from "@/services/balance.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { mainMenuKeyboard } from "@/utils/keyboard";

export const handleBalance = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const { carriedForwardBalance, totalIncome, totalExpense, totalNetBalance } =
    await getBalanceDetails(user.id);

  const messageLines = [
    "📊 **လက်ရှိ ငွေစာရင်း အခြေအနေ**",
    "",
    `💰 **NET BALANCE:** ${formatCurrency(totalNetBalance)}`,
  ];

  // Show the carried-forward indicator when a balance is carried in.
  if (carriedForwardBalance !== 0) {
    messageLines.push(
      `*(ယခင်လများမှ ကျန်ငွေ: ${formatCurrency(carriedForwardBalance)})*`,
    );
  }

  messageLines.push(
    "",
    `📈 **ဒီလ ဝင်ငွေ:** +${formatCurrency(totalIncome)}`,
    `📉 **ဒီလ ထွက်ငွေ:** -${formatCurrency(totalExpense)}`,
  );

  const message = messageLines.join("\n");

  return sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: mainMenuKeyboard(),
  });
};
