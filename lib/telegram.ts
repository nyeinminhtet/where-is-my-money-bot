import type {
  TelegramInlineKeyboardMarkup,
  TelegramReplyKeyboardMarkup,
} from "@/types/telegram";
import { env } from "./env";

function getBotToken(): string {
  const token = env.telegramBotToken;

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

  const response = await fetch(`${env.telegramApiUrl}/bot${token}/${method}`, {
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
  showAlert: boolean = false,
) {
  return telegramRequest("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert, // If text is provided, show an alert; otherwise, just acknowledge
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

export const sendPhoto = async (chatId: number | string, photoUrl: string, caption?: string) => {
  return telegramRequest("sendPhoto", {
    chat_id: chatId,
    photo: photoUrl,
    caption,
    parse_mode: "Markdown",
  });
};