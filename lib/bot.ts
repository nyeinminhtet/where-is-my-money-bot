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
import {
  createTransaction,
  getTotalExpenseThisMonth,
} from "@/services/transaction.service";
import { sendMessage } from "./telegram";
import { formatCurrency } from "@/utils/formatCurrency";
import { undoKeyboard } from "@/utils/keyboard";
import { handleHelp } from "@/handlers/helpe.handler";

import { processUserAIQuery } from "@/services/ai-query.service"; // 🟢 Import သစ် ထည့်ရန်

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
  // Commands & Main Menu Texts
  // -----------------------------
  switch (command) {
    case "/start":
      return handleStart(update, user);
    case "/help":
      return handleHelp(update);
    case "/balance":
      return handleBalance(update, user);
    case "/set_budget":
      return askForBudget(update, user.id);

    case "/check_budget":
      return handleCheckBudget(update, user);
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
  // 🔥 1. Number Only Check (e.g. "1000", "၁၀၀၀") -> Manual Mode
  // -----------------------------
  const isOnlyNumbers = text ? /^[0-9၁-၉\s,]+$/.test(text.trim()) : false;

  if (isOnlyNumbers) {
    return handleAmount(update, user);
  }

  // -----------------------------
  // 🔥 2. AI Handling (Query vs Transaction Parser)
  // -----------------------------
  if (text && !isOnlyNumbers) {
    // 🟢 2.1 Query Pattern စစ်ဆေးခြင်း
    const IS_QUERY_PATTERN =
      /(ဘယ်လောက်|ကုန်လဲ|စရိတ်|စာရင်းပြ|ရလဲ|သုံးလိုက်တာ|ကုန်သွား|သုံးထား)/i;

    if (IS_QUERY_PATTERN.test(text)) {
      if (chatId) {
        const queryReply = await processUserAIQuery(user.id, text);
        return sendMessage(chatId, queryReply);
      }
      return;
    }

    // 🟢 2.2 Transaction Parser စစ်ဆေးခြင်း
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
            category: tx.category || "အခြား",
            description: tx.description || text,
          });

          if (createdTx.type === "EXPENSE") {
            hasExpense = true;
          }

          const typeText = createdTx.type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";

          const singleTxMessage = [
            `✅ စာရင်းသွင်းပြီးပါပြီ။`,
            ``,
            `📌 အမျိုးအစား - ${typeText}`,
            `📂 ကဏ္ဍ - ${createdTx.category}`,
            `💰 ပမာဏ - ${formatCurrency(createdTx.amount)}`,
            `📝 မှတ်ချက် - ${createdTx.description || "မရှိပါ"}`,
          ].join("\n");

          if (chatId) {
            await sendMessage(chatId, singleTxMessage, {
              reply_markup: undoKeyboard(createdTx.id),
            });
          }
        }

        if (hasExpense && user.monthlyBudget && chatId) {
          const totalExpense = await getTotalExpenseThisMonth(user.id);
          const budget = user.monthlyBudget;
          const percentageUsed = ((totalExpense / budget) * 100).toFixed(1);

          let budgetMessage = [
            `📊 **လစဉ် Budget အခြေအနေ:**`,
            `- သုံးပြီးသမျှ: ${formatCurrency(totalExpense)} / ${formatCurrency(budget)} (${percentageUsed}%)`,
          ].join("\n");

          if (totalExpense >= budget) {
            budgetMessage +=
              "\n\n🚨 **သတိပေးချက်:** ဒီလအတွက် သတ်မှတ်ထားတဲ့ Budget ပြည့်/ကျော်သွားပါပြီ။ 📉";
          } else if (totalExpense >= budget * 0.8) {
            budgetMessage +=
              "\n\n⚠️ **သတိပေးချက်:** ဒီလ Budget ရဲ့ 80% ကျော်သွားပါပြီ။ သတိထားသုံးစွဲပေးပါဦး။";
          }

          await sendMessage(chatId, budgetMessage);
        }

        await clearSession(user.id);

        return; // 🟢 Transaction သွင်းပြီးရင် ရပ်မည်
      } else {
        // 🟢 2.3 Transaction မဟုတ်ဘဲ အလကား စာအပိုရိုက်ထားတာဆိုရင် (ဥပမာ- "ငါဘယ်သူလဲ", "ဘာလဲဟ")
        if (chatId) {
          return sendMessage(
            chatId,
            "ကျွန်တော်က အသုံးစရိတ် စာရင်းမှတ်ပေးတဲ့ Bot ပါဗျ။ 📊 စာရင်းမှတ်ချင်ရင် 'မနက်စာ ၄၅၀၀' လို့ ရိုက်ပါ သို့မဟုတ် စာရင်းမေးချင်ရင် 'ဒီလ အစားအသောက် ဘယ်လောက် ကုန်လဲ' လို့ မေးနိုင်ပါတယ်ဗျ။",
          );
        }
        return;
      }
    } else {
      if (chatId) {
        return sendMessage(
          chatId,
          "⚠️ လက်ရှိတွင် AI စနစ် ခေတ္တ မအားလပ်သေးပါ (Rate Limit ပြည့်နေပါသည်)။ ခဏစောင့်၍ ထပ်မံစမ်းသပ်ပေးပါဗျာ။",
        );
      }
      return;
    }
  }

  // -----------------------------
  // 3. Callback Queries
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
  // 4. Manual Step-by-step Conversation State Machine
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
