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

export const handlePhoto = async (update: TelegramUpdate, user: User) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const photos = update.message?.photo;
  if (!photos || photos.length === 0) return;

  try {
    await sendChatAction(chatId, "upload_photo");

    // 1. Select highest resolution photo (last in array)
    const highestRes = photos[photos.length - 1];

    // 2. Get file info from Telegram
    const fileInfo = await getFile(highestRes.file_id);
    if (!fileInfo.file_path) {
      return sendMessage(chatId, "⚠️ ဓာတ်ပုံ ရယူ၍ မရပါ။ ထပ်မံကြိုးစားပါ။");
    }

    // 3. Download the image buffer
    const imageBuffer = await downloadFile(fileInfo.file_path);

    // 4. Parse with unified Gemini handler
    const aiResults = await parseInputWithGemini({
      mode: "photo",
      buffer: imageBuffer,
      mimeType: "image/jpeg",
    });

    if (!aiResults || aiResults.length === 0) {
      return sendMessage(
        chatId,
        "🧾 ဓာတ်ပုံထဲတွင် ငွေစာရင်း မတွေ့ပါ။ ဘေလ်သို့မဟုတ် ပြေစာပုံ ဖြစ်အောင် ပြန်လည်ရိုက်ကူးပေးပါဗျ။",
      );
    }

    // 5. Create transactions
    let hasExpense = false;
    for (const tx of aiResults) {
      if (tx.amount <= 0) continue;

      const createdTx = await createTransaction({
        userId: user.id,
        amount: tx.amount,
        type: tx.type,
        category: tx.category || "အခြား",
        description: tx.title || "ဓာတ်ပုံဖြင့်မှတ်ထားသည်",
      });

      if (createdTx.type === "EXPENSE") hasExpense = true;

      const typeText = createdTx.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";
      const msg = [
        "✅ ဓာတ်ပုံဖြင့် စာရင်းသွင်းပြီးပါပြီ။",
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
    console.error("Photo handler error:", error);
    return sendMessage(
      chatId,
      "⚠️ ဓာတ်ပုံ စီမံခြင်းတွင် အမှားရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။",
    );
  }
};
