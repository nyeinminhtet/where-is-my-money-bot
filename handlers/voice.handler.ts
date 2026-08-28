import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";
import { processMultimodalMedia } from "@/lib/helpers/multimodal";

export const handleVoice = (update: TelegramUpdate, user: User) => {
  return processMultimodalMedia(update, user, {
    fileAccessor: (u) => u.message?.voice,
    action: "record_voice",
    mimeType: "audio/ogg",
    mode: "voice",
    header: "✅ အသံဖြင့် စာရင်းသွင်းပြီးပါပြီ။",
    noResultsMessage:
      "🎤 အသံထဲတွင် ငွေစာရင်း မတွေ့ပါ။ ငွေပမာဏနှင့် အကြောင်းအရာ ပါဝင်အောင် ပြောပြပေးပါဗျ။",
    fetchErrorMessage: "⚠️ အသံဖိုင် ရယူ၍ မရပါ။ ထပ်မံကြိုးစားပါ။",
    processErrorMessage:
      "⚠️ အသံဖိုင် စီမံခြင်းတွင် အမှားရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။",
    defaultDescription: "အသံဖြင့်မှတ်ထားသည်",
  });
};
