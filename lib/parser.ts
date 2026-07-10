import type {
  TelegramCallbackQuery,
  TelegramMessage,
  TelegramUpdate,
  TelegramUser,
} from "@/types/telegram";

/**
 * Get message object from update.
 */
export function getMessage(update: TelegramUpdate): TelegramMessage | null {
  return update.message ?? update.callback_query?.message ?? null;
}

/**
 * Get callback query object.
 */
export function getCallbackQuery(
  update: TelegramUpdate,
): TelegramCallbackQuery | null {
  return update.callback_query ?? null;
}

/**
 * Get chat id.
 */
export function getChatId(update: TelegramUpdate): number | null {
  return getMessage(update)?.chat.id ?? null;
}

/**
 * Get telegram user.
 */
export function getUser(update: TelegramUpdate): TelegramUser | null {
  return update.message?.from ?? update.callback_query?.from ?? null;
}

/**
 * Get message text.
 */
export function getMessageText(update: TelegramUpdate): string {
  return update.message?.text?.trim() ?? "";
}

/**
 * Check if update contains callback query.
 */
export function isCallback(update: TelegramUpdate): boolean {
  return !!update.callback_query;
}

/**
 * Get callback data.
 */
export function getCallbackData(update: TelegramUpdate): string {
  return update.callback_query?.data ?? "";
}

/**
 * Check if message is a command.
 */
export function isCommand(update: TelegramUpdate): boolean {
  return getMessageText(update).startsWith("/");
}

/**
 * Get command only.
 *
 * /start
 * /balance
 * /report
 */
export function getCommand(update: TelegramUpdate): string | null {
  if (!isCommand(update)) {
    return null;
  }

  return getMessageText(update).split(" ")[0];
}

/**
 * Check if message contains text.
 */
export function hasText(update: TelegramUpdate): boolean {
  return getMessageText(update).length > 0;
}
