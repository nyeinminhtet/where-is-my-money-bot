import type {
  TelegramInlineKeyboardMarkup,
  TelegramReplyKeyboardMarkup,
} from "@/types/telegram";

const TELEGRAM_API_URL = "https://api.telegram.org";

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is missing");
  }

  return token;
}

async function telegramRequest<T>(
  method: string,
  body: Record<string, unknown>,
): Promise<T> {
  const token = getBotToken();

  const response = await fetch(`${TELEGRAM_API_URL}/bot${token}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.description || "Telegram API request failed");
  }

  return data.result;
}

export async function sendMessage(
  chatId: number | string,
  text: string,
  options?: {
    reply_markup?: TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup;
    parse_mode?: "HTML" | "Markdown";
  },
) {
  return telegramRequest("sendMessage", {
    chat_id: chatId,
    text,
    ...options,
  });
}

export async function editMessage(
  chatId: number,
  messageId: number,
  text: string,
  options?: {
    reply_markup?: TelegramInlineKeyboardMarkup;
    parse_mode?: "HTML" | "Markdown";
  },
) {
  return telegramRequest("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...options,
  });
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
) {
  return telegramRequest("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  });
}

export async function deleteMessage(chatId: number, messageId: number) {
  return telegramRequest("deleteMessage", {
    chat_id: chatId,
    message_id: messageId,
  });
}

export async function setWebhook(url: string) {
  return telegramRequest("setWebhook", {
    url,
  });
}
