import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { getMonthlyReport } from "@/services/report.service";

import { formatCurrency } from "@/utils/formatCurrency";

import {
  getCurrentMonthRange,
  getCurrentMonth,
  getCurrentYear,
} from "@/utils/date";
import { sendReportWithChart } from "@/lib/report-chart";

export const handleMonthly = async (update: TelegramUpdate, user: User) => {
    const chatId = getChatId(update);
    if (!chatId)
        return;
    const { start, end } = getCurrentMonthRange();
    const report = await getMonthlyReport(user.id, start, end);
    const month = getCurrentMonth();
    const year = getCurrentYear();
    const incomeLines = report.categoryIncomes && report.categoryIncomes.length > 0
        ? [
            "",
            "--- 💰 ဝင်ငွေ ရရှိသော ကဏ္ဍများ ---",
            ...report.categoryIncomes.map((item) => {
                const amount = item._sum.amount ?? 0;
                const percentage = report.income > 0
                    ? ((amount / report.income) * 100).toFixed(1)
                    : 0;
                return `🔸 ${item.category} - ${formatCurrency(amount)} (${percentage}%)`;
            }),
        ]
        : [];
    const expenseLines = report.categoryExpenses && report.categoryExpenses.length > 0
        ? [
            "",
            "--- 📂 အသုံးများသော ကဏ္ဍများ ---",
            ...report.categoryExpenses.map((item) => {
                const amount = item._sum.amount ?? 0;
                const percentage = report.expense > 0
                    ? ((amount / report.expense) * 100).toFixed(1)
                    : 0;
                return `🔹 ${item.category} - ${formatCurrency(amount)} (${percentage}%)`;
            }),
        ]
        : [];
    const message = [
        `📅 ${year} / ${month} လစာရင်း`,
        "",
        `💰 ဝင်ငွေ: ${formatCurrency(report.income)}`,
        `💸 ထွက်ငွေ: ${formatCurrency(report.expense)}`,
        "",
        `💵 လက်ကျန်: ${formatCurrency(report.balance)}`,
        ...incomeLines,
        ...expenseLines,
    ].join("\n");
    return sendReportWithChart(chatId, message, report.categoryExpenses ?? []);
};
