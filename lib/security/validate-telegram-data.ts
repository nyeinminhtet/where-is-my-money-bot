import { createHmac, timingSafeEqual } from "crypto";

import { env } from "@/lib/env";

export interface TelegramMiniAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface ValidatedTelegramData {
  user: TelegramMiniAppUser;
  authDate: Date;
  queryId?: string;
  chatType?: string;
  chatInstance?: string;
  startParam?: string;
  canSendMessages?: boolean;
  canSendInlineMessages?: boolean;
}

const parseInitData = (
  initData: string,
): Record<string, string> => {
  const params = new URLSearchParams(initData);
  const data: Record<string, string> = {};
  params.forEach((value, key) => {
    data[key] = value;
  });
  return data;
};

const checkInitDataHash = (
  data: Record<string, string>,
  botToken: string,
): boolean => {
  const hash = data.hash;
  if (!hash) return false;

  const dataCheckArr = Object.entries(data)
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const computedHash = createHmac("sha256", secretKey)
    .update(dataCheckArr)
    .digest("hex");

  if (computedHash.length !== hash.length) return false;

  return timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
};

export const validateTelegramInitData = (
  initData: string,
): ValidatedTelegramData | null => {
  if (!initData) return null;

  const data = parseInitData(initData);

  if (!checkInitDataHash(data, env.telegram.botToken)) {
    return null;
  }

  const authDate = Number(data.auth_date);
  if (isNaN(authDate)) return null;

  const thirtyMinutesAgo = Math.floor(Date.now() / 1000) - 1800;
  if (authDate < thirtyMinutesAgo) return null;

  let user: TelegramMiniAppUser | null = null;
  if (data.user) {
    try {
      user = JSON.parse(data.user);
    } catch {
      return null;
    }
  }
  if (!user?.id) return null;

  return {
    user,
    authDate: new Date(authDate * 1000),
    queryId: data.query_id,
    chatType: data.chat_type,
    chatInstance: data.chat_instance,
    startParam: data.start_param,
    canSendMessages: data.can_send_messages === "true",
    canSendInlineMessages: data.can_send_inline_messages === "true",
  };
};

export const verifyWebAppSecret = (
  headerValue: string | null,
): boolean => {
  if (!headerValue) return false;

  const expected = env.telegram.webhookSecret;
  if (headerValue.length !== expected.length) return false;

  return timingSafeEqual(Buffer.from(headerValue), Buffer.from(expected));
};
