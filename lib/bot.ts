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
import { handleReport } from "@/handlers/report.handler";
import { handleMonthly } from "@/handlers/monthly.handler";
import { handleYearly } from "@/handlers/yearly.handler";
import { handleUndo } from "@/handlers/undo.handler";

export async function handleTelegramUpdate(update: TelegramUpdate) {
  const telegramUser = update.message?.from ?? update.callback_query?.from;

  if (!telegramUser) {
    return;
  }

  const user = await findOrCreateUser(telegramUser);

  const session = await getOrCreateSession(user.id);

  const command = getCommand(update);

  // -----------------------------
  // Commands
  // -----------------------------

  switch (command) {
    case "/start":
      return handleStart(update, user);

    case "/balance":
      return handleBalance(update, user);

    case "/report":
      return handleReport(update, user);

    case "/monthly":
      return handleMonthly(update, user);

    case "/yearly":
      return handleYearly(update, user);
  }

  // -----------------------------
  // Callback Queries
  // -----------------------------

  if (update.callback_query?.data === "undo") {
    return handleUndo(update, user);
  }

  // -----------------------------
  // Conversation State Machine
  // -----------------------------

  switch (session.currentState) {
    case SessionState.IDLE:
      return handleAmount(update, user);

    case SessionState.WAITING_TYPE:
      return handleType(update, user);

    case SessionState.WAITING_CATEGORY:
      return handleCategory(update, user);

    case SessionState.WAITING_DESCRIPTION:
      return handleDescription(update, user);

    default:
      return handleAmount(update, user);
  }
}
