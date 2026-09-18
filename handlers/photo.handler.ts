import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";
import { processMultimodalMedia } from "@/lib/helpers/multimodal";
import { getTranslation, type Locale } from "@/lib/i18n";

export const handlePhoto = (update: TelegramUpdate, user: User, userLanguage: Locale) => {
  const lang = userLanguage;
  return processMultimodalMedia(update, user, {
    fileAccessor: (u) => {
      const photos = u.message?.photo;
      return photos && photos.length > 0 ? photos[photos.length - 1] : undefined;
    },
    action: "upload_photo",
    mimeType: "image/jpeg",
    mode: "photo",
    header: getTranslation(lang, "PHOTO_SAVED"),
    noResultsMessage: getTranslation(lang, "PHOTO_NO_RESULTS"),
    fetchErrorMessage: getTranslation(lang, "PHOTO_FETCH_ERROR"),
    processErrorMessage: getTranslation(lang, "PHOTO_PROCESS_ERROR"),
    defaultDescription: getTranslation(lang, "PHOTO_DEFAULT_DESC"),
  });
};
