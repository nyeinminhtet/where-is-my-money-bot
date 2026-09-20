import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { getChatId } from "@/lib/telegram/parser";
import { sendMessage } from "@/lib/telegram/client";
import { getMonthlyReport, getTodayReport } from "@/services/report.service";
import { formatCurrency } from "@/utils/format-currency";
import { getTodayRange } from "@/utils/date";
import { mainMenuKeyboard } from "@/utils/keyboard";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleToday = async (update: TelegramUpdate, user: User, userLanguage: Locale) => {
    const chatId = getChatId(update);
    if (!chatId) return;

    const lang = userLanguage;
    const { start, end } = getTodayRange();
    const report = await getMonthlyReport(user.id, start, end);
    const todayTransactions = await getTodayReport(user.id, start, end);

    const itemLines = todayTransactions.length > 0
        ? todayTransactions.map((t) => {
            const icon = t.type === "INCOME" ? "➕" : "➖";
            return getTranslation(lang, "TODAY_ITEM", {
                icon,
                amount: formatCurrency(t.amount),
                description: t.description || t.category || "General",
            });
        })
        : [getTranslation(lang, "TODAY_NO_TRANSACTIONS")];

    const message = [
        getTranslation(lang, "TODAY_HEADER"),
        getTranslation(lang, "TODAY_INCOME", { amount: formatCurrency(report.income) }),
        getTranslation(lang, "TODAY_EXPENSE", { amount: formatCurrency(report.expense) }),
        "",
        getTranslation(lang, "TODAY_DETAIL_HEADER"),
        ...itemLines,
    ].join("\n");

    return sendMessage(chatId, message, {
        reply_markup: mainMenuKeyboard(lang),
    });
};
