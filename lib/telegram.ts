import axios from "axios";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function sendMessage(
  chatId: number | string,
  text: string,
  options?: {
    parse_mode?: "Markdown" | "HTML";
    reply_markup?: object;
  },
) {
  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    ...options,
  });
}

export async function editMessage(
  chatId: number | string,
  messageId: number,
  text: string,
  options?: {
    parse_mode?: "Markdown" | "HTML";
    reply_markup?: object;
  },
) {
  return axios.post(`${TELEGRAM_API}/editMessageText`, {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...options,
  });
}

export async function deleteMessage(
  chatId: number | string,
  messageId: number,
) {
  return axios.post(`${TELEGRAM_API}/deleteMessage`, {
    chat_id: chatId,
    message_id: messageId,
  });
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
) {
  return axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackQueryId,
    text,
  });
}

export async function setWebhook(url: string) {
  return axios.post(`${TELEGRAM_API}/setWebhook`, {
    url,
  });
}
