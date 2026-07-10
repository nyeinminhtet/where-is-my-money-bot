import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { sendMessage } from "@/lib/telegram";

import { getBalance } from "@/services/balance.service";

import { formatCurrency } from "@/utils/formatCurrency";

export async function handleBalance(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const balance = await getBalance(user.id);

  const message = [
    "💰 လက်ကျန်ငွေ",
    "",
    `Total: ${formatCurrency(balance)}`,
  ].join("\n");

  return sendMessage(chatId, message);
}
