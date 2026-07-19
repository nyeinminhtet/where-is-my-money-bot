import { SessionState } from "@/generated/prisma/client";

import type { TelegramUpdate } from "@/types/telegram";

import { getCommand } from "@/lib/parser";

import { getOrCreateSession } from "@/lib/session";

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

export async function handleTelegramUpdate(update: TelegramUpdate) {
  const telegramUser = update.message?.from ?? update.callback_query?.from;

  if (!telegramUser) {
    return;
  }

  const user = await findOrCreateUser(telegramUser);

  const session = await getOrCreateSession(user.id);

  const command = getCommand(update);

  const text = update.message?.text;

  // -----------------------------
  // Commands
  // -----------------------------

  switch (command) {
    case "/start":
      return handleStart(update, user);

    case "/balance":
      return handleBalance(update, user);

    // case "/report":
    //   return handleReport(update, user);

    case "/today":
      return handleToday(update, user);

    case "/monthly":
      return handleMonthly(update, user);

    case "/previous_month":
      return handlePreviousMonth(update, user);

    case "/yearly":
      return handleYearly(update, user);
  }

  if (text === MENU.BALANCE) {
    return handleBalance(update, user);
  }

  if (text === MENU.TODAY) {
    return handleToday(update, user);
  }

  if (text === MENU.MONTHLY) {
    return handleMonthly(update, user);
  }

  if (text === MENU.PREVIOUS_MONTH) {
    return handlePreviousMonth(update, user);
  }

  if (text === MENU.YEARLY) {
    return handleYearly(update, user);
  }

  if (text === MENU.SET_BUDGET) {
    return askForBudget(update, user.id);
  }

  if (text === MENU.CHECK_BUDGET) {
    return handleCheckBudget(update, user);
  }

  // ၂။ အကယ်၍ User က ဂဏန်းရိုက်ထည့်ရမယ့် State ထဲ ရောက်နေလျှင်
  if (session.currentState === SessionState.WAITING_BUDGET) {
    return handleBudgetInput(update, user);
  }

  // -----------------------------
  // Callback Queries
  // -----------------------------

  const callbackData = update.callback_query?.data;

  console.log("Callback Data:", callbackData);

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
