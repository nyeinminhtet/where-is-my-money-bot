import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getChatId } from "@/lib/parser";
import { parseInputWithGemini } from "@/lib/gemini-multimodal";
import {
  sendMessage,
  sendChatAction,
  getFile,
  downloadFile,
} from "@/lib/telegram";
import { createTransaction } from "@/services/transaction.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { undoKeyboard } from "@/utils/keyboard";
import { checkAndSendBudgetWarning } from "./budget.handler";

export const handleVoice = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const voice = update.message?.voice;
  if (!voice) return;

  try {
    await sendChatAction(chatId, "record_voice");

    // 1. Get file info from Telegram
    const fileInfo = await getFile(voice.file_id);
    if (!fileInfo.file_path) {
      return sendMessage(chatId, "⚠️ အသံဖိုင် ရယူ၍ မရပါ။ ထပ်မံကြိုးစားပါ။");
    }

    // 2. Download the audio buffer
    const audioBuffer = await downloadFile(fileInfo.file_path);

    // 3. Parse with unified Gemini handler
    const aiResults = await parseInputWithGemini({
      mode: "voice",
      buffer: audioBuffer,
      mimeType: voice.mime_type || "audio/ogg",
    });

    if (!aiResults || aiResults.length === 0) {
      return sendMessage(
        chatId,
        "🎤 အသံထဲတွင် ငွေစာရင်း မတွေ့ပါ။ ငွေပမာဏနှင့် အကြောင်းအရာ ပါဝင်အောင် ပြောပြပေးပါဗျ။",
      );
    }

    // 4. Create transactions
    let hasExpense = false;
    for (const tx of aiResults) {
      if (tx.amount <= 0) continue;

      const createdTx = await createTransaction({
        userId: user.id,
        amount: tx.amount,
        type: tx.type,
        category: tx.category || "အခြား",
        description: tx.title || "အသံဖြင့်မှတ်ထားသည်",
      });

      if (createdTx.type === "EXPENSE") hasExpense = true;

      const typeText = createdTx.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";
      const msg = [
        "✅ အသံဖြင့် စာရင်းသွင်းပြီးပါပြီ။",
        "",
        `📌 အမျိုးအစား - ${typeText}`,
        `📂 ကဏ္ဍ - ${createdTx.category}`,
        `💰 ပမာဏ - ${formatCurrency(createdTx.amount)}`,
        `📝 မှတ်ချက် - ${createdTx.description || "မရှိပါ"}`,
      ].join("\n");

      await sendMessage(chatId, msg, {
        reply_markup: undoKeyboard(createdTx.id),
      });
    }

    if (hasExpense) {
      await checkAndSendBudgetWarning(
        { id: user.id, monthlyBudget: user.monthlyBudget },
        chatId,
      );
    }
  } catch (error) {
    console.error("Voice handler error:", error);
    return sendMessage(
      chatId,
      "⚠️ အသံဖိုင် စီမံခြင်းတွင် အမှားရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။",
    );
  }
};
