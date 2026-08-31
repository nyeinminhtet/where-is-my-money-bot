import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getChatId } from "@/lib/telegram/parser";
import {
  sendMessage,
  sendChatAction,
  getFile,
  downloadFile,
} from "@/lib/telegram/client";
import {
  parseInputWithGemini,
} from "@/lib/ai/gemini";
import { createTransaction } from "@/services/transaction.service";
import { undoKeyboard } from "@/utils/keyboard";
import {
  buildTransactionSummaryMessage,
  normalizeCategory,
} from "@/lib/helpers/transaction-summary";
import { checkAndSendBudgetWarning } from "@/handlers/budget.handler";

interface MultimodalConfig {
  fileAccessor: (update: TelegramUpdate) => { file_id: string } | undefined;
  action: "record_voice" | "upload_photo";
  mimeType: string;
  mode: "voice" | "photo";
  header: string;
  noResultsMessage: string;
  fetchErrorMessage: string;
  processErrorMessage: string;
  defaultDescription: string;
}

export const processMultimodalMedia = async (
  update: TelegramUpdate,
  user: User,
  config: MultimodalConfig,
) => {
  const chatId = getChatId(update);
  if (!chatId) return;

  const fileSource = config.fileAccessor(update);
  if (!fileSource) return;

  try {
    await sendChatAction(chatId, config.action);

    const fileInfo = await getFile(fileSource.file_id);
    if (!fileInfo.file_path) {
      return sendMessage(chatId, config.fetchErrorMessage);
    }

    const buffer = await downloadFile(fileInfo.file_path);

    const aiResults = await parseInputWithGemini({
      mode: config.mode,
      buffer,
      mimeType: config.mimeType,
    });

    if (!aiResults || aiResults.length === 0) {
      return sendMessage(chatId, config.noResultsMessage);
    }

    let hasExpense = false;
    for (const tx of aiResults) {
      if (tx.amount <= 0) continue;

      const createdTx = await createTransaction({
        userId: user.id,
        amount: tx.amount,
        type: tx.type,
        category: normalizeCategory(tx.category),
        description: tx.title || config.defaultDescription,
      });

      if (createdTx.type === "EXPENSE") hasExpense = true;

      const msg = buildTransactionSummaryMessage(createdTx, {
        header: config.header,
      });

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
    console.error(`${config.mode} handler error:`, error);
    return sendMessage(chatId, config.processErrorMessage);
  }
};
