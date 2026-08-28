import type {
  TelegramFile,
  TelegramInlineKeyboardMarkup,
  TelegramReplyKeyboardMarkup,
} from "@/types/telegram";
import { env } from "@/lib/env";

const getBotToken = (): string => {
    const token = env.telegram.botToken;
    if (!token) {
        throw new Error("TELEGRAM_BOT_TOKEN is missing");
    }
    return token;
};

const telegramRequest = async <T>(method: string, body: Record<string, unknown>): Promise<T> => {
    const token = getBotToken();
    const response = await fetch(`${env.telegram.apiUrl}/bot${token}/${method}`, {
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
};

export const sendMessage = async (chatId: number | string, text: string, options?: {
    reply_markup?: TelegramInlineKeyboardMarkup | TelegramReplyKeyboardMarkup;
    parse_mode?: "HTML" | "Markdown";
}) => {
    return telegramRequest("sendMessage", {
        chat_id: chatId,
        text,
        ...options,
    });
};

export const editMessage = async (chatId: number, messageId: number, text: string, options?: {
    reply_markup?: TelegramInlineKeyboardMarkup;
    parse_mode?: "HTML" | "Markdown";
}) => {
    return telegramRequest("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text,
        ...options,
    });
};

export const answerCallbackQuery = async (callbackQueryId: string, text?: string, showAlert: boolean = false) => {
    return telegramRequest("answerCallbackQuery", {
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert, // If text is provided, show an alert; otherwise, just acknowledge
    });
};

export const deleteMessage = async (chatId: number, messageId: number) => {
    return telegramRequest("deleteMessage", {
        chat_id: chatId,
        message_id: messageId,
    });
};

export const setWebhook = async (url: string) => {
    return telegramRequest("setWebhook", {
        url,
    });
};

export const sendPhoto = async (
  chatId: number | string,
  photoUrl: string,
  caption?: string,
) => {
  return telegramRequest("sendPhoto", {
    chat_id: chatId,
    photo: photoUrl,
    caption,
    parse_mode: "Markdown",
  });
};

export const sendChatAction = async (
  chatId: number | string,
  action: "typing" | "upload_photo" | "record_voice" | "upload_voice",
) => {
  return telegramRequest("sendChatAction", {
    chat_id: chatId,
    action,
  });
};

export const getFile = async (fileId: string): Promise<TelegramFile> => {
  return telegramRequest<TelegramFile>("getFile", {
    file_id: fileId,
  });
};

export const downloadFile = async (filePath: string): Promise<ArrayBuffer> => {
  const token = env.telegram.botToken;
  const url = `${env.telegram.apiUrl}/file/bot${token}/${filePath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  return response.arrayBuffer();
};
