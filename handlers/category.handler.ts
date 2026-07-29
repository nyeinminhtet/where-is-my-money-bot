import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { SessionState } from "@/generated/prisma/client";

import { getChatId, getCallbackData } from "@/lib/parser";

import { updateTempCategory, updateState, getSession } from "@/lib/session";

import { sendMessage } from "@/lib/telegram";
import { DEFAULT_CATEGORIES } from "@/constants/categories";

export const handleCategory = async (update: TelegramUpdate, user: User) => {
    const chatId = getChatId(update);
    if (!chatId)
        return;
    const callbackData = getCallbackData(update);
    if (!callbackData) {
        return sendMessage(chatId, "အမျိုးအစား ရွေးပါ။");
    }
    if (!callbackData.startsWith("CATEGORY_")) {
        return sendMessage(chatId, "အမျိုးအစား မမှန်ပါ။");
    }
    // const category = callbackData.replace("CATEGORY_", "");
    const categoryIndex = Number(callbackData.replace("CATEGORY_", ""));
    if (Number.isNaN(categoryIndex)) {
        return sendMessage(chatId, "အမျိုးအစား မမှန်ပါ။");
    }
    const session = await getSession(user.id);
    if (!session?.tempType) {
        return sendMessage(chatId, "ဝင်ငွေ / ထွက်ငွေ မရှိပါ။");
    }
    const categories = DEFAULT_CATEGORIES[session.tempType];
    const category = categories[categoryIndex];
    if (!category) {
        return sendMessage(chatId, "အမျိုးအစား မမှန်ပါ။");
    }
    await updateTempCategory(user.id, category);
    await updateState(user.id, SessionState.WAITING_DESCRIPTION);
    // return sendMessage(chatId, "အသေးစိတ်ဖော်ပြချက် ထည့်ပါ။");
    return sendMessage(chatId, "📝 အသေးစိတ်ဖော်ပြချက် ထည့်ပါ (သို့မဟုတ် ကျော်ပါ)။", {
        reply_markup: {
            inline_keyboard: [
                [{ text: "⏩ ကျော်မည်", callback_data: "DESCRIPTION_SKIP" }],
            ],
        },
    });
};
