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

// Default fallback category used when none can be inferred.
export const DEFAULT_CATEGORY = "အခြား";

// Expense categories available to the Gemini parsing models.
export const GEMINI_EXPENSE_CATEGORIES = [
  "အစားအသောက်",
  "သွားလာရေး",
  "အိမ်စရိတ်",
  "မီး/ရေ/အင်တာနက်",
  "ကျန်းမာရေး",
  "ဈေးဝယ်ခြင်း",
  "ဖျော်ဖြေရေး",
  "အခြား",
];

export const CATEGORY_BUTTONS_PER_ROW = 2;
