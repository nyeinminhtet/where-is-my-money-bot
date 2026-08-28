import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/telegram/parser";

import { getMonthlyReport } from "@/services/report.service";

import { formatCurrency } from "@/utils/formatCurrency";

import {
  getCurrentMonthRange,
  getCurrentMonth,
  getCurrentYear,
} from "@/utils/date";
import { sendReportWithChart } from "@/lib/charts/report-chart";
import { buildCategoryBreakdownLines } from "@/lib/helpers/category-breakdown";

export const handleMonthly = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;
  const { start, end } = getCurrentMonthRange();
  const report = await getMonthlyReport(user.id, start, end);
  const month = getCurrentMonth();
  const year = getCurrentYear();
  const breakdownLines = buildCategoryBreakdownLines({
    categoryIncomes: report.categoryIncomes,
    categoryExpenses: report.categoryExpenses,
    income: report.income,
    expense: report.expense,
  });
  const message = [
    `📅 ${year} / ${month} လစာရင်း`,
    "",
    `💰 ဝင်ငွေ: ${formatCurrency(report.income)}`,
    `💸 ထွက်ငွေ: ${formatCurrency(report.expense)}`,
    "",
    `💵 လက်ကျန်: ${formatCurrency(report.balance)}`,
    ...breakdownLines,
  ].join("\n");
  return sendReportWithChart(chatId, message, report.categoryExpenses ?? []);
};
