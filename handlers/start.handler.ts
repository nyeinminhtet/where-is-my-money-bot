import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { SessionState } from "@/generated/prisma/client";

import { sendMessage } from "@/lib/telegram";
import { getChatId } from "@/lib/parser";
import { updateState } from "@/lib/session";
import { mainMenuKeyboard } from "@/utils/keyboard";

export const handleStart = async (update: TelegramUpdate, user: User) => {
    const chatId = getChatId(update);
    if (!chatId)
        return;
    await updateState(user.id, SessionState.IDLE);
    const welcomeMessage = `👋 မင်္ဂလာပါ *${user.firstName ?? ""}*!

🚀 **Where Is My Money** မှ လှိုက်လှဲစွာ ကြိုဆိုပါတယ်။

💵 **စတင်အသုံးပြုနည်း -**
• ငွေပမာဏ (ဥပမာ- \`50000\`) ကို ရိုက်ထည့်ပါ။
• ဝင်ငွေ (Income) သို့မဟုတ် ထွက်ငွေ (Expense) ခွဲခြားပါ။
• သက်ဆိုင်ရာ အမျိုးအစား (Category) ကို ရွေးချယ်ပါ။

💡 *အခုပဲ ဂဏန်းတစ်ခုခု ရိုက်ထည့်ပြီး စမ်းသပ်ကြည့်လိုက်ပါ!*`;
    await sendMessage(chatId, welcomeMessage, {
        reply_markup: mainMenuKeyboard(),
    });
};
