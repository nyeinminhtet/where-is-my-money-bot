import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { getChatId } from "@/lib/telegram/parser";
import { getMonthlyReport } from "@/services/report.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getPreviousMonthRange } from "@/utils/date";
import { sendReportWithChart } from "@/lib/charts/report-chart";
import { buildCategoryBreakdownLines } from "@/lib/helpers/category-breakdown";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handlePreviousMonth = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const lang = userLanguage;
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
    getTranslation(lang, "PREV_MONTH_HEADER", { year: yearLabel, month: monthLabel }),
    "---------------------------------",
    getTranslation(lang, "PREV_MONTH_INCOME", { amount: formatCurrency(report.income) }),
    getTranslation(lang, "PREV_MONTH_EXPENSE", { amount: formatCurrency(report.expense) }),
    getTranslation(lang, "PREV_MONTH_BALANCE", { amount: formatCurrency(report.balance) }),
    ...breakdownLines,
  ].join("\n");

  return sendReportWithChart(chatId, message, report.categoryExpenses ?? []);
};
