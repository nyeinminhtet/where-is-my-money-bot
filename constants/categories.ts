import { TransactionType } from "@/generated/prisma/client";

export const DEFAULT_CATEGORIES: Record<TransactionType, string[]> = {
  INCOME: [
    "လစာ",

    "စီးပွားရေး",

    "Freelance",

    "လက်ဆောင်",

    "ရင်းနှီးမြှုပ်နှံမှု",

    "အခြား",
  ],

  EXPENSE: [
    "အစားအသောက်",

    "သွားလာရေး",

    "အိမ်ငှားခ",

    "မီး/ရေ/အင်တာနက်",

    "ကျန်းမာရေး",

    "ဈေးဝယ်ခြင်း",

    "ပညာရေး",

    "ဖျော်ဖြေရေး",

    "မိသားစု",

    "အခြား",
  ],
};

export const CATEGORY_BUTTONS_PER_ROW = 2;
