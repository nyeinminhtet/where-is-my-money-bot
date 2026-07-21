// 📂 handlers/undo.handler.ts

import type { TelegramUpdate } from "@/types/telegram";
import type { User } from "@/generated/prisma/client";

import { getChatId } from "@/lib/parser";
import { sendMessage, answerCallbackQuery, editMessage } from "@/lib/telegram";
import { deleteTransactions } from "@/services/transaction.service";

export async function handleUndo(update: TelegramUpdate, user: User) {
  const chatId = getChatId(update);
  const callbackQuery = update.callback_query;
  const callbackData = callbackQuery?.data;
  const messageId = callbackQuery?.message?.message_id;

  if (!chatId || !callbackData) return;

  // 1. စာရင်းအဟောင်းများအတွက် Exception စစ်ဆေးခြင်း
  if (callbackData === "UNDO_LAST") {
    if (callbackQuery?.id) {
      await answerCallbackQuery(
        callbackQuery.id,
        "စာရင်းအဟောင်းဖြစ်၍ ဖျက်မရပါ",
      );
    }
    return sendMessage(
      chatId,
      "⚠️ ဒီစာရင်းက စနစ်မပြောင်းခင်က စာရင်းအဟောင်းဖြစ်တဲ့အတွက် Bot ထဲကနေ လှမ်းဖျက်လို့ မရတော့ပါ။",
    );
  }

  // 2. UNDO_ အနောက်က ID များကို Parse လုပ်ယူခြင်း (e.g. "UNDO_id1,id2")
  const rawIds = callbackData.replace("UNDO_", "");
  const transactionIds = rawIds.split(",").filter(Boolean);

  if (transactionIds.length === 0) return;

  try {
    // 3. DB ထဲမှ Transaction(s) များကို ဖျက်ခြင်း
    const deleted = await deleteTransactions(transactionIds, user.id);

    if (!deleted || deleted.count === 0) {
      if (callbackQuery?.id) {
        await answerCallbackQuery(callbackQuery.id, "ဖျက်ပြီးသား ဖြစ်နေပါသည်");
      }
      return sendMessage(
        chatId,
        "⚠️ ဒီစာရင်းက ဖျက်ပြီးသား ဖြစ်နေလို့ ထပ်ဖျက်လို့ မရတော့ပါ။",
      );
    }

    // 4. Telegram Popup Notification Alert ပြပေးခြင်း
    if (callbackQuery?.id) {
      await answerCallbackQuery(
        callbackQuery.id,
        "စာရင်းကို အောင်မြင်စွာ ဖျက်လိုက်ပါပြီ!",
      );
    }

    // 5. မူလ "✅ စာရင်းသွင်းပြီးပါပြီ" Message ကြီးကို "🗑️ ပြန်ဖျက်လိုက်ပါပြီ" သို့ Edit လုပ်လိုက်ခြင်း (Undo Button ပျောက်သွားမည်)
    if (messageId) {
      return editMessage(
        chatId,
        messageId,
        `🗑️ **အထက်ပါ စာရင်းသွင်းမှု (${deleted.count}) ခုလုံးကို ပြန်ဖျက်လိုက်ပါပြီ။**`,
      );
    }

    // Fallback: တကယ်လို့ messageId မရခဲ့ရင် Message အသစ် ထပ်ပို့မည်
    return sendMessage(
      chatId,
      `🗑️ **အထက်ပါ စာရင်းသွင်းမှု (${deleted.count}) ခုလုံးကို ပြန်ဖျက်လိုက်ပါပြီ။**`,
    );
  } catch (error) {
    console.error("Undo error:", error);
    if (callbackQuery?.id) {
      await answerCallbackQuery(
        callbackQuery.id,
        "ဖျက်ရာတွင် အမှားအယွင်းရှိနေပါသည်",
      );
    }
    return sendMessage(
      chatId,
      "❌ စာရင်းဖျက်ရာတွင် အမှားအယွင်း ဖြစ်ပေါ်သွားပါသည်။",
    );
  }
}
