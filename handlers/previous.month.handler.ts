import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { getChatId } from "@/lib/telegram/parser";
import { getMonthlyReport } from "@/services/report.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getPreviousMonthRange } from "@/utils/date";
import { sendReportWithChart } from "@/lib/charts/report-chart";
import { buildCategoryBreakdownLines } from "@/lib/helpers/category-breakdown";

export const handlePreviousMonth = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;
  const { start, end } = getPreviousMonthRange();
  const report = await getMonthlyReport(user.id, start, end);
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const monthLabel = prevDate.getMonth() + 1;
  const yearLabel = prevDate.getFullYear();
  const breakdownLines = buildCategoryBreakdownLines({
    categoryIncomes: report.categoryIncomes,
    categoryExpenses: report.categoryExpenses,
    income: report.income,
    expense: report.expense,
  });
  const message = [
    `📅 ${yearLabel} ခုနှစ် / ${monthLabel} လပိုင်း စာရင်းချုပ်`,
    "---------------------------------",
    `💰 ဝင်ငွေစုစုပေါင်း: ${formatCurrency(report.income)}`,
    `💸 ထွက်ငွေစုစုပေါင်း: ${formatCurrency(report.expense)}`,
    `💵 လက်ကျန်စုစုပေါင်း: ${formatCurrency(report.balance)}`,
    ...breakdownLines,
  ].join("\n");
  return sendReportWithChart(chatId, message, report.categoryExpenses ?? []);
};
