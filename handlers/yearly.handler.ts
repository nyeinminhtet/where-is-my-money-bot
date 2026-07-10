import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { sendMessage } from "@/lib/telegram";

import { getYearlyReport } from "@/services/report.service";

import { formatCurrency } from "@/utils/formatCurrency";

import { getCurrentYear, getCurrentYearRange } from "@/utils/date";

export async function handleYearly(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const { start, end } = getCurrentYearRange();

  const report = await getYearlyReport(user.id, start, end);

  const year = getCurrentYear();

  const message = [
    `📆 ${year} နှစ်စာရင်း`,
    "",
    `💰 Income: ${formatCurrency(report.income)}`,
    `💸 Expense: ${formatCurrency(report.expense)}`,
    "",
    `💵 Balance: ${formatCurrency(report.balance)}`,
  ].join("\n");

  return sendMessage(chatId, message);
}
