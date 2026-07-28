import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";

import { sendMessage, sendPhoto } from "@/lib/telegram";

import { getYearlyReport } from "@/services/report.service";

import { formatCurrency } from "@/utils/formatCurrency";

import { getCurrentYear, getCurrentYearRange } from "@/utils/date";
import { generateYearlyBarChartUrl } from "@/lib/quickchart";

export async function handleYearly(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);

  if (!chatId) return;

  const { start, end } = getCurrentYearRange();

  const report = await getYearlyReport(user.id, start, end);

  const year = getCurrentYear();

  const breakdownLines =
    report.monthlyBreakdown && report.monthlyBreakdown.length > 0
      ? [
          "",
          "--- 📈 လအလိုက် အနှစ်ချုပ် ---",
          ...report.monthlyBreakdown
            .filter((m) => m.hasData)
            .map((m) => {
              return `📅 ${m.month} လပိုင်း: 💰 +${formatCurrency(m.income)} | 💸 -${formatCurrency(m.expense)}`;
            }),
        ]
      : [];

  const message = [
    `📅 ${year} ခုနှစ် နှစ်ချုပ်စာရင်း`,
    "",
    `💰 ဝင်ငွေ: ${formatCurrency(report.income)}`,
    `💸 ထွက်ငွေ: ${formatCurrency(report.expense)}`,
    "",
    `💵 လက်ကျန်: ${formatCurrency(report.balance)}`,
    ...breakdownLines, // ✨ လအလိုက်စာရင်းကို အောက်က ဆက်ပြတာ
  ].join("\n");

  if (report.monthlyBreakdown && report.monthlyBreakdown.length > 0) {
    const chartUrl = generateYearlyBarChartUrl(report.monthlyBreakdown, year);
    return sendPhoto(chatId, chartUrl, message);
  }

  return sendMessage(chatId, message);
}
