import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { sendMessage } from "@/lib/telegram";

import { getSummary } from "@/services/report.service";

import { formatCurrency } from "@/utils/formatCurrency";

export async function handleReport(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const summary = await getSummary(user.id);

  const message = [
    "📊 စာရင်းအကျဉ်းချုပ်",
    "",
    `💰 ဝင်ငွေ: ${formatCurrency(summary.income)}`,
    `💸 ထွက်ငွေ: ${formatCurrency(summary.expense)}`,
    "",
    `💵 လက်ကျန်: ${formatCurrency(summary.balance)}`,
  ].join("\n");

  return sendMessage(chatId, message);
}
