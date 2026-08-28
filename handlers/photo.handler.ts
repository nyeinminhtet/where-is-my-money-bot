import type { User } from "@/generated/prisma/client";
import type { TelegramUpdate } from "@/types/telegram";
import { processMultimodalMedia } from "@/lib/helpers/multimodal";

export const handlePhoto = (update: TelegramUpdate, user: User) => {
  return processMultimodalMedia(update, user, {
    fileAccessor: (u) => {
      const photos = u.message?.photo;
      return photos && photos.length > 0 ? photos[photos.length - 1] : undefined;
    },
    action: "upload_photo",
    mimeType: "image/jpeg",
    mode: "photo",
    header: "✅ ဓာတ်ပုံဖြင့် စာရင်းသွင်းပြီးပါပြီ။",
    noResultsMessage:
      "🧾 ဓာတ်ပုံထဲတွင် ငွေစာရင်း မတွေ့ပါ။ ဘေလ်သို့မဟုတ် ပြေစာပုံ ဖြစ်အောင် ပြန်လည်ရိုက်ကူးပေးပါဗျ။",
    fetchErrorMessage: "⚠️ ဓာတ်ပုံ ရယူ၍ မရပါ။ ထပ်မံကြိုးစားပါ။",
    processErrorMessage:
      "⚠️ ဓာတ်ပုံ စီမံခြင်းတွင် အမှားရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။",
    defaultDescription: "ဓာတ်ပုံဖြင့်မှတ်ထားသည်",
  });
};
