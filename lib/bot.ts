import { SessionState } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";

import { getCommand } from "@/lib/parser";
import { clearSession, getOrCreateSession } from "@/lib/session";
import { findOrCreateUser } from "@/services/user.service";

import { handleStart } from "@/handlers/start.handler";
import { handleAmount } from "@/handlers/amount.handler";
import { handleType } from "@/handlers/type.handler";
import { handleCategory } from "@/handlers/category.handler";
import { handleDescription } from "@/handlers/description.handler";
import { handleBalance } from "@/handlers/balance.handler";
import { handleMonthly } from "@/handlers/monthly.handler";
import { handleYearly } from "@/handlers/yearly.handler";
import { handleUndo } from "@/handlers/undo.handler";
import { MENU } from "@/constants/menu";
import { handleToday } from "@/handlers/today.handler";
import { handlePreviousMonth } from "@/handlers/previous.month.handler";
import {
  askForBudget,
  handleBudgetInput,
  handleCheckBudget,
} from "@/handlers/budget.handler";
import { parseTextWithAI } from "./gemini";
import { createTransaction } from "@/services/transaction.service";
import { sendMessage } from "./telegram";
import { formatCurrency } from "@/utils/formatCurrency";
import { undoKeyboard } from "@/utils/keyboard";

export async function handleTelegramUpdate(update: TelegramUpdate) {
  const telegramUser = update.message?.from ?? update.callback_query?.from;

  if (!telegramUser) {
    return;
  }

  const user = await findOrCreateUser(telegramUser);
  const session = await getOrCreateSession(user.id);
  const command = getCommand(update);
  const text = update.message?.text;
  const chatId = update.message?.chat.id;

  // -----------------------------
  // Commands
  // -----------------------------

  switch (command) {
    case "/start":
      return handleStart(update, user);

    case "/balance":
      return handleBalance(update, user);

    case "/today":
      return handleToday(update, user);

    case "/monthly":
      return handleMonthly(update, user);

    case "/previous_month":
      return handlePreviousMonth(update, user);

    case "/yearly":
      return handleYearly(update, user);
  }

  if (text === MENU.BALANCE) return handleBalance(update, user);
  if (text === MENU.TODAY) return handleToday(update, user);
  if (text === MENU.MONTHLY) return handleMonthly(update, user);
  if (text === MENU.PREVIOUS_MONTH) return handlePreviousMonth(update, user);
  if (text === MENU.YEARLY) return handleYearly(update, user);
  if (text === MENU.SET_BUDGET) return askForBudget(update, user.id);
  if (text === MENU.CHECK_BUDGET) return handleCheckBudget(update, user);

  if (session.currentState === SessionState.WAITING_BUDGET) {
    return handleBudgetInput(update, user);
  }

  // -----------------------------
  // 🔥 Number Only Check (e.g. "1000", "၁၀၀၀") -> Manual Mode
  // -----------------------------
  const isOnlyNumbers = text ? /^[0-9၁-၉\s,]+$/.test(text.trim()) : false;

  if (
    isOnlyNumbers &&
    (session.currentState === SessionState.IDLE ||
      session.currentState === SessionState.WAITING_AMOUNT)
  ) {
    // ဂဏန်းချည်းပဲ ရိုက်လာရင် Step-by-step Flow (handleAmount) သို့ တိုက်ရိုက်ပို့မည်
    return handleAmount(update, user);
  }

  // -----------------------------
  // 🔥 AI Quick Transaction Parser
  // -----------------------------
  console.log("💬 User Input:", text);
  if (
    text &&
    !isOnlyNumbers &&
    (session.currentState === SessionState.IDLE ||
      session.currentState === SessionState.WAITING_AMOUNT)
  ) {
    const aiResults = await parseTextWithAI(text);

    console.log("🔍 AI Results Log:", JSON.stringify(aiResults, null, 2));

    if (aiResults && Array.isArray(aiResults)) {
      const validTransactions = aiResults.filter(
        (tx) => tx.isTransaction && tx.amount > 0,
      );

      if (validTransactions.length > 0) {
        const savedTxList = [];

        for (const tx of validTransactions) {
          const createdTx = await createTransaction({
            userId: user.id,
            amount: tx.amount,
            type: tx.type,
            category: tx.category || "အခြား",
            description: tx.description || text,
          });
          savedTxList.push(createdTx);
        }

        await clearSession(user.id);

        const responseMsg = [
          `✅ **စာရင်း (${savedTxList.length}) ခု အောင်မြင်စွာ သွင်းပြီးပါပြီ!**`,
          "",
          ...validTransactions.map(
            (tx, index) =>
              `${index + 1}. **${tx.description}** - ${formatCurrency(tx.amount)} (${tx.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ"} / ${tx.category})`,
          ),
        ].join("\n");

        if (chatId) {
          return sendMessage(chatId, responseMsg, {
            reply_markup: undoKeyboard(savedTxList.map((tx) => tx.id)),
          });
        }
      } else {
        // ⚠️ AI က ဖတ်လို့မရရင် သို့မဟုတ် Transaction အဖြစ် မသတ်မှတ်နိုင်ရင်
        if (chatId) {
          return sendMessage(
            chatId,
            "⚠️ စာရင်းအသေးစိတ်ကို မဖတ်ရှုနိုင်ပါဗျာ။ စာကြောင်းပုံစံကို ပြန်လည်စစ်ဆေးပေးပါ သို့မဟုတ် Manual သွင်းပေးပါဗျ။",
          );
        }
      }
    }
  }

  // -----------------------------
  // Callback Queries
  // -----------------------------

  const callbackData = update.callback_query?.data;

  if (callbackData?.startsWith("UNDO_")) {
    return handleUndo(update, user);
  }

  if (callbackData?.startsWith("TYPE_")) {
    return handleType(update, user);
  }

  if (callbackData?.startsWith("CATEGORY_")) {
    return handleCategory(update, user);
  }

  if (callbackData === "DESCRIPTION_SKIP") {
    return handleDescription(update, user);
  }

  // -----------------------------
  // Conversation State Machine
  // -----------------------------

  if (!update.callback_query) {
    switch (session.currentState) {
      case SessionState.WAITING_AMOUNT:
      case SessionState.IDLE:
        return handleAmount(update, user);

      case SessionState.WAITING_DESCRIPTION:
        return handleDescription(update, user);

      default:
        return;
    }
  }
}
