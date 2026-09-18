import type { Locale, TranslationKey } from "@/lib/i18n";

type CategoryKey =
  | "လစာ"
  | "စီးပွားရေး"
  | "Freelance"
  | "လက်ဆောင်"
  | "ရင်းနှီးမြှုပ်နှံမှု"
  | "အခြား"
  | "အစားအသောက်"
  | "သွားလာရေး"
  | "အိမ်ငှားခ"
  | "မီး/ရေ/အင်တာနက်"
  | "ကျန်းမာရေး"
  | "ဈေးဝယ်ခြင်း"
  | "ပညာရေး"
  | "ဖျော်ဖြေရေး"
  | "မိသားစု";

const CATEGORY_MAP: Record<CategoryKey, TranslationKey> = {
  "လစာ": "CAT_SALARY",
  "စီးပွားရေး": "CAT_BUSINESS",
  "Freelance": "CAT_FREELANCE",
  "လက်ဆောင်": "CAT_GIFT",
  "ရင်းနှီးမြှုပ်နှံမှု": "CAT_INVESTMENT",
  "အခြား": "CAT_OTHER",
  "အစားအသောက်": "CAT_FOOD",
  "သွားလာရေး": "CAT_TRANSPORT",
  "အိမ်ငှားခ": "CAT_RENT",
  "မီး/ရေ/အင်တာနက်": "CAT_UTILITIES",
  "ကျန်းမာရေး": "CAT_HEALTH",
  "ဈေးဝယ်ခြင်း": "CAT_SHOPPING",
  "ပညာရေး": "CAT_EDUCATION",
  "ဖျော်ဖြေရေး": "CAT_ENTERTAINMENT",
  "မိသားစု": "CAT_FAMILY",
};

export const getCategoryName = (
  category: string,
  lang: Locale,
  t: (key: TranslationKey) => string,
): string => {
  const key = CATEGORY_MAP[category as CategoryKey];
  if (key) return t(key);
  return category;
};

export const getAllCategoryKeys = (): CategoryKey[] => {
  return Object.keys(CATEGORY_MAP) as CategoryKey[];
};
