import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";
import { SessionState } from "@/generated/prisma/client";

import { sendMessage } from "@/lib/telegram";
import { getChatId } from "@/lib/parser";
import { updateState } from "@/lib/session";
import { mainMenuKeyboard } from "@/utils/keyboard";

export const handleStart = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;
  await updateState(user.id, SessionState.IDLE);
  const welcomeMessage = `👋 မင်္ဂလာပါ *${user.firstName ?? ""}*!

🚀 **Where Is My Money** မှ လှိုက်လှဲစွာ ကြိုဆိုပါတယ်။

နေ့စဉ် ဘဏ္ဍာရေး စာရင်းတွေကို AI ရဲ့ အကူအညီနဲ့ Telegram ကနေ အလွယ်တကူ စီမံခန့်ခွဲလိုက်ပါ။

💡 **စတင်အသုံးပြုနိုင်သည့် နည်းလမ်းများ -**
1️⃣ **🤖 AI Smart Auto-Log:** Chat ထဲမှာ စကားပြောသလို ရိုက်ပါ (ဥပမာ - \"မနက်စာ ၁၅၀၀ ကုန်တယ်\" သို့မဟုတ် \"Freelance ၅၀၀၀၀ ရတယ်\")။ AI က ပမာဏနဲ့ Category များကို အလိုအလျောက် ခွဲခြား စာရင်းသွင်းပေးပါလိမ့်မည်။
2️⃣ **📱 Open Dashboard:** အောက်က **"Open Mini App"** Button ကို နှိပ်ပြီး Visual Charts နဲ့ Full Analytics များကို ကြည့်ရှုပါ။

⚡ *အခုပဲ \"မနက်စာ ၁၅၀၀ ကုန်တယ်\" လို့ ရိုက်ထည့်ပြီး စမ်းသပ်ကြည့်လိုက်ပါ!*`;

  await sendMessage(chatId, welcomeMessage, {
    reply_markup: mainMenuKeyboard(),
  });
};
