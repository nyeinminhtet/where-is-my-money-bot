import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";
import { processMultimodalMedia } from "@/lib/helpers/multimodal";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handleVoice = (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const lang = userLanguage;
  return processMultimodalMedia(update, user, {
    fileAccessor: (u) => u.message?.voice,
    action: "record_voice",
    mimeType: "audio/ogg",
    mode: "voice",
    header: getTranslation(lang, "VOICE_SAVED"),
    noResultsMessage: getTranslation(lang, "VOICE_NO_RESULTS"),
    fetchErrorMessage: getTranslation(lang, "VOICE_FETCH_ERROR"),
    processErrorMessage: getTranslation(lang, "VOICE_PROCESS_ERROR"),
    defaultDescription: getTranslation(lang, "VOICE_DEFAULT_DESC"),
  });
};
