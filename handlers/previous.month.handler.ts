import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { getChatId } from "@/lib/parser";
import { getMonthlyReport } from "@/services/report.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getPreviousMonthRange } from "@/utils/date";
import { sendReportWithChart } from "@/lib/report-chart";

export async function handlePreviousMonth(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);
  if (!chatId) return;

  // ၁။ ပြီးခဲ့တဲ့လရဲ့ ရက်စွဲ Range ကို ယူမယ် (ဥပမာ- ဇွန် ၁ ကနေ ၃၀)
  const { start, end } = getPreviousMonthRange();
  const report = await getMonthlyReport(user.id, start, end);

  // ၂။ စာသားပြဖို့အတွက် ပြီးခဲ့တဲ့လရဲ့ "လအမည်" နဲ့ "ခုနှစ်" ကို တွက်မယ်
  const prevDate = new Date();
  prevDate.setMonth(prevDate.getMonth() - 1);
  const monthLabel = prevDate.getMonth() + 1; // 1-based index (ဥပမာ- ဇွန်လဆိုရင် 6)
  const yearLabel = prevDate.getFullYear();

  // ၃။ Category အလိုက် ဝင်ငွေများကို Format ချမယ်
  const incomeLines =
    report.categoryIncomes && report.categoryIncomes.length > 0
      ? [
          "",
          "--- 💰 ဝင်ငွေ ရရှိသော ကဏ္ဍများ ---",
          ...report.categoryIncomes.map((item) => {
            const amount = item._sum.amount ?? 0;
            const percentage =
              report.income > 0
                ? ((amount / report.income) * 100).toFixed(1)
                : 0;
            return `🔸 ${item.category} - ${formatCurrency(amount)} (${percentage}%)`;
          }),
        ]
      : [];

  // ၄။ Category အလိုက် ထွက်ငွေများကို Format ချမယ်
  const expenseLines =
    report.categoryExpenses && report.categoryExpenses.length > 0
      ? [
          "",
          "--- 📂 အသုံးများသော ကဏ္ဍများ ---",
          ...report.categoryExpenses.map((item) => {
            const amount = item._sum.amount ?? 0;
            const percentage =
              report.expense > 0
                ? ((amount / report.expense) * 100).toFixed(1)
                : 0;
            return `🔹 ${item.category} - ${formatCurrency(amount)} (${percentage}%)`;
          }),
        ]
      : [];

  const message = [
    `📅 ${yearLabel} ခုနှစ် / ${monthLabel} လပိုင်း စာရင်းချုပ်`,
    "---------------------------------",
    `💰 ဝင်ငွေစုစုပေါင်း: ${formatCurrency(report.income)}`,
    `💸 ထွက်ငွေစုစုပေါင်း: ${formatCurrency(report.expense)}`,
    `💵 လက်ကျန်စုစုပေါင်း: ${formatCurrency(report.balance)}`,
    ...incomeLines,
    ...expenseLines,
  ].join("\n");

  return sendReportWithChart(chatId, message, report.categoryExpenses ?? []);
}
