import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { sendMessage } from "@/lib/telegram";

import { getMonthlyReport } from "@/services/report.service";

import { formatCurrency } from "@/utils/formatCurrency";

import {
  getCurrentMonthRange,
  getCurrentMonth,
  getCurrentYear,
} from "@/utils/date";

export async function handleMonthly(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const { start, end } = getCurrentMonthRange();

  const report = await getMonthlyReport(user.id, start, end);

  const month = getCurrentMonth();

  const year = getCurrentYear();

  const message = [
    `📅 ${year} / ${month} လစာရင်း`,
    "",
    `💰 ဝင်ငွေ: ${formatCurrency(report.income)}`,
    `💸 ထွက်ငွေ: ${formatCurrency(report.expense)}`,
    "",
    `💵 လက်ကျန်: ${formatCurrency(report.balance)}`,
  ].join("\n");

  return sendMessage(chatId, message);
}
