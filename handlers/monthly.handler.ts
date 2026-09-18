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
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleMonthly = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const lang = userLanguage;
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
    getTranslation(lang, "MONTHLY_HEADER", { year, month }),
    "",
    getTranslation(lang, "MONTHLY_INCOME", { amount: formatCurrency(report.income) }),
    getTranslation(lang, "MONTHLY_EXPENSE", { amount: formatCurrency(report.expense) }),
    "",
    getTranslation(lang, "MONTHLY_BALANCE", { amount: formatCurrency(report.balance) }),
    ...breakdownLines,
  ].join("\n");

  return sendReportWithChart(chatId, message, report.categoryExpenses ?? []);
};
