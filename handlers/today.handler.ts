// 📂 src/handlers/today.ts

import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { getChatId } from "@/lib/telegram/parser";
import { sendMessage } from "@/lib/telegram/client";
import { getMonthlyReport, getTodayReport } from "@/services/report.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTodayRange } from "@/utils/date";
import { mainMenuKeyboard } from "@/utils/keyboard";

export const handleToday = async (update: TelegramUpdate, user: User) => {
    const chatId = getChatId(update);
    if (!chatId)
        return;
    const { start, end } = getTodayRange();
    const report = await getMonthlyReport(user.id, start, end);
    const todayTransactions = await getTodayReport(user.id, start, end);
    const itemLines = todayTransactions.length > 0
        ? todayTransactions.map((t) => {
            const icon = t.type === "INCOME" ? "➕" : "➖";
            return `${icon} ${formatCurrency(t.amount)} - ${t.description || t.category || "အထွေထွေ"}`;
        })
        : ["❌ ယနေ့အတွင်း စာရင်းသွင်းထားခြင်း မရှိသေးပါ။"];
    const message = [
        `📅 ဒီနေ့ စာရင်းအကျဥ်းချုပ်`,
        "---------------------------------",
        `💰 ဝင်ငွေစုစုပေါင်း - ${formatCurrency(report.income)}`,
        `💸 ထွက်ငွေစုစုပေါင်း - ${formatCurrency(report.expense)}`,
        "",
        "📝 ယနေ့သုံးစွဲမှု အသေးစိတ်:",
        ...itemLines,
    ].join("\n");
    return sendMessage(chatId, message, {
        reply_markup: mainMenuKeyboard(),
    });
};
