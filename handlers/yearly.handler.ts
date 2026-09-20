import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/telegram/parser";

import { sendMessage, sendPhoto } from "@/lib/telegram/client";

import { getYearlyReport } from "@/services/report.service";

import { formatCurrency } from "@/utils/format-currency";

import { getCurrentYear, getCurrentYearRange } from "@/utils/date";
import { generateYearlyBarChartUrl } from "@/lib/charts/quickchart";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleYearly = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
    const chatId = getChatId(update);
    if (!chatId) return;

    const lang = userLanguage;
    const { start, end } = getCurrentYearRange();
    const report = await getYearlyReport(user.id, start, end);
    const year = getCurrentYear();

    const breakdownLines = report.monthlyBreakdown && report.monthlyBreakdown.length > 0
        ? [
            "",
            getTranslation(lang, "YEARLY_MONTHLY_BREAKDOWN"),
            ...report.monthlyBreakdown
                .filter((m) => m.hasData)
                .map((m) => {
                return getTranslation(lang, "YEARLY_MONTH_ITEM", {
                    month: m.month,
                    income: formatCurrency(m.income),
                    expense: formatCurrency(m.expense),
                });
            }),
        ]
        : [];

    const message = [
        getTranslation(lang, "YEARLY_HEADER", { year }),
        "",
        getTranslation(lang, "YEARLY_INCOME", { amount: formatCurrency(report.income) }),
        getTranslation(lang, "YEARLY_EXPENSE", { amount: formatCurrency(report.expense) }),
        "",
        getTranslation(lang, "YEARLY_BALANCE", { amount: formatCurrency(report.balance) }),
        ...breakdownLines,
    ].join("\n");

    if (report.monthlyBreakdown && report.monthlyBreakdown.length > 0) {
        const chartUrl = generateYearlyBarChartUrl(report.monthlyBreakdown, year);
        return sendPhoto(chatId, chartUrl, message);
    }
    return sendMessage(chatId, message);
};
