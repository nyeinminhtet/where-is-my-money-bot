import { SessionState } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getCommand } from "@/lib/telegram/parser";
import { clearSession, getOrCreateSession } from "@/lib/session";
import { findOrCreateUser } from "@/services/user.service";
import type { Locale } from "@/lib/i18n";

import { handleStart } from "@/handlers/start.handler";
import { handleAmount } from "@/handlers/amount.handler";
import { handleType } from "@/handlers/type.handler";
import { handleCategory } from "@/handlers/category.handler";
import { handleDescription } from "@/handlers/description.handler";
import { handleBalance } from "@/handlers/balance.handler";
import { handleMonthly } from "@/handlers/monthly.handler";
import { handleYearly } from "@/handlers/yearly.handler";
import { handleUndo } from "@/handlers/undo.handler";
import { isMenuCommand } from "@/constants/menu";
import { handleToday } from "@/handlers/today.handler";
import { handlePreviousMonth } from "@/handlers/previous.month.handler";
import {
  askForBudget,
  checkAndSendBudgetWarning,
  handleBudgetInput,
  handleCheckBudget,
} from "@/handlers/budget.handler";
import { parseTextWithAI } from "@/lib/ai/gemini";
import { createTransaction } from "@/services/transaction.service";
import { sendMessage } from "@/lib/telegram/client";
import { undoKeyboard } from "@/utils/keyboard";
import { handleHelp } from "@/handlers/help.handler";
import { handleVoice } from "@/handlers/voice.handler";
import { handlePhoto } from "@/handlers/photo.handler";
import { handleLanguage, handleLanguageCallback } from "@/handlers/language.handler";

import { processUserAIQuery } from "@/services/ai-query.service";
import { checkAndUpdateAiQuota } from "@/services/rate-limit.service";
import {
  buildTransactionSummaryMessage,
  normalizeCategory,
} from "@/lib/helpers/transaction-summary";
import { getTranslation } from "@/lib/i18n";

export const handleTelegramUpdate = async (update: TelegramUpdate) => {
  const telegramUser = update.message?.from ?? update.callback_query?.from;
  if (!telegramUser) {
    return;
  }

  const user = await findOrCreateUser(telegramUser);
  const userLanguage: Locale = (user.language as Locale) || "mm";
  const session = await getOrCreateSession(user.id);
  const command = getCommand(update);
  const text = update.message?.text;
  const chatId = update.message?.chat.id;

  // -----------------------------
  // 0. Voice & Photo Message Handling (before text processing)
  // -----------------------------
  if (update.message?.voice) {
    return handleVoice(update, user, userLanguage);
  }
  if (update.message?.photo) {
    return handlePhoto(update, user, userLanguage);
  }

  // -----------------------------
  // 1. Commands & Main Menu Texts
  // -----------------------------
  switch (command) {
    case "/start":
      return handleStart(update, userLanguage);
    case "/help":
      return handleHelp(update, userLanguage);
    case "/balance":
      return handleBalance(update, user, userLanguage);
    case "/set_budget":
      return askForBudget(update, user.id, userLanguage);
    case "/check_budget":
      return handleCheckBudget(update, user, userLanguage);
    case "/today":
      return handleToday(update, user, userLanguage);
    case "/monthly":
      return handleMonthly(update, user, userLanguage);
    case "/previous_month":
      return handlePreviousMonth(update, user, userLanguage);
    case "/yearly":
      return handleYearly(update, user, userLanguage);
    case "/language":
      return handleLanguage(update, user);
  }

  if (text && isMenuCommand(text, "BALANCE")) return handleBalance(update, user, userLanguage);
  if (text && isMenuCommand(text, "TODAY")) return handleToday(update, user, userLanguage);
  if (text && isMenuCommand(text, "MONTHLY")) return handleMonthly(update, user, userLanguage);
  if (text && isMenuCommand(text, "PREVIOUS_MONTH")) return handlePreviousMonth(update, user, userLanguage);
  if (text && isMenuCommand(text, "YEARLY")) return handleYearly(update, user, userLanguage);
  if (text && isMenuCommand(text, "SET_BUDGET")) return askForBudget(update, user.id, userLanguage);
  if (text && isMenuCommand(text, "CHECK_BUDGET")) return handleCheckBudget(update, user, userLanguage);

  // -----------------------------
  // 2. Callback Queries Handling
  // -----------------------------
  const callbackData = update.callback_query?.data;
  if (callbackData?.startsWith("UNDO_")) {
    return handleUndo(update, user, userLanguage);
  }
  if (callbackData?.startsWith("TYPE_")) {
    return handleType(update, user, userLanguage);
  }
  if (callbackData?.startsWith("CATEGORY_")) {
    return handleCategory(update, user, userLanguage);
  }
  if (callbackData?.startsWith("LANG_")) {
    return handleLanguageCallback(update, user);
  }
  if (callbackData === "DESCRIPTION_SKIP") {
    return handleDescription(update, user, userLanguage);
  }

  // -----------------------------
  // 3. Active Manual Session States Check (before AI dispatch)
  // -----------------------------
  if (session.currentState === (SessionState.WAITING_BUDGET as SessionState)) {
    return handleBudgetInput(update, user, userLanguage);
  }

  if (
    !update.callback_query &&
    session.currentState === SessionState.WAITING_DESCRIPTION
  ) {
    return handleDescription(update, user, userLanguage);
  }

  // -----------------------------
  // 4. Help / Onboarding Pattern Check
  // -----------------------------
  const IS_HELP_PATTERN = /(ဘယ်လို|စရမလဲ|သုံးရမလဲ|ကူညီပါ|help|စတင်|getting started|how to)/i;
  if (text && IS_HELP_PATTERN.test(text.trim())) {
    if (chatId) {
      return sendMessage(chatId, getTranslation(userLanguage, "HELP_PATTERN"));
    }
    return;
  }

  // -----------------------------
  // 5. Number Only Check (e.g. "1000", "၁၀၀၀") -> Manual Mode
  // -----------------------------
  const isOnlyNumbers = text ? /^[0-9၁-၉\s,]+$/.test(text.trim()) : false;
  if (isOnlyNumbers) {
    return handleAmount(update, user, userLanguage);
  }

  // -----------------------------
  // 6. AI Handling (Search Query vs Transaction Parser)
  // -----------------------------
  if (text && !isOnlyNumbers) {
    // 6.1 Search Query Pattern Regex Match
    const IS_QUERY_PATTERN =
      /(ဘယ်လောက်|ကုန်လဲ|စရိတ်|စာရင်းပြ|ရလဲ|သုံးလိုက်တာ|ကုန်သွား|သုံးထား|ဘာက|ဘယ်ဟာ|အဓိက|အများဆုံး|ကျော်|what|how|much|many|spend|spent|earn|earned|cost|total|list|show|income|expense)/i;

    if (IS_QUERY_PATTERN.test(text)) {
      if (chatId) {
        const quota = await checkAndUpdateAiQuota(
          user.id,
          String(telegramUser.id),
          user.role,
        );

        if (!quota.allowed) {
          return sendMessage(chatId, getTranslation(userLanguage, "AI_QUOTA_EXCEEDED"));
        }

        const queryReply = await processUserAIQuery(user.id, text, user.language);
        return sendMessage(chatId, queryReply);
      }
      return;
    }

    // 6.2 Transaction Parser Flow
    const aiResults = await parseTextWithAI(text);
    if (aiResults && Array.isArray(aiResults)) {
      const validTransactions = aiResults.filter(
        (tx) => tx.isTransaction && tx.amount > 0,
      );
      let hasExpense = false;
      if (validTransactions.length > 0) {
        for (const tx of validTransactions) {
          const createdTx = await createTransaction({
            userId: user.id,
            amount: tx.amount,
            type: tx.type,
            category: normalizeCategory(tx.category),
            description: tx.description || text,
          });
          if (createdTx.type === "EXPENSE") {
            hasExpense = true;
          }
          const singleTxMessage = buildTransactionSummaryMessage(createdTx, {
            header: getTranslation(userLanguage, "TX_SAVED"),
            language: userLanguage,
          });
          if (chatId) {
            await sendMessage(chatId, singleTxMessage, {
              reply_markup: undoKeyboard(createdTx.id, userLanguage),
            });
          }
        }
        if (hasExpense && chatId) {
          await checkAndSendBudgetWarning(
            { id: user.id, monthlyBudget: user.monthlyBudget },
            chatId,
            userLanguage,
          );
        }
        await clearSession(user.id);
        return;
      } else {
        if (chatId) {
          return sendMessage(chatId, getTranslation(userLanguage, "NOT_A_TRANSACTION"));
        }
        return;
      }
    } else {
      if (chatId) {
        return sendMessage(chatId, getTranslation(userLanguage, "AI_RATE_LIMIT"));
      }
      return;
    }
  }

  // -----------------------------
  // 7. Fallback Conversation State
  // -----------------------------
  if (!update.callback_query) {
    switch (session.currentState) {
      case SessionState.WAITING_AMOUNT:
      case SessionState.IDLE:
        return handleAmount(update, user, userLanguage);
      default:
        return;
    }
  }
};
