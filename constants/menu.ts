import { getTranslation, type Locale, type TranslationKey } from "@/lib/i18n";

export const MENU = {
  BALANCE: "💰 လက်ကျန်ငွေ",
  TODAY: "📅 ယနေ့စာရင်း",
  MONTHLY: "📅 ယခုလ",
  PREVIOUS_MONTH: "📅 ပြီးခဲ့သည့်လ",
  YEARLY: "📆 ယခုနှစ်",
  SET_BUDGET: "⚙️ ဘတ်ဂျက်သတ်မှတ်",
  CHECK_BUDGET: "📊 ဘတ်ဂျက်အခြေအနေ",
} as const;

export const MENU_EN = {
  BALANCE: "💰 Balance",
  TODAY: "📅 Today",
  MONTHLY: "📅 Monthly",
  PREVIOUS_MONTH: "📅 Previous Month",
  YEARLY: "📆 Yearly",
  SET_BUDGET: "⚙️ Set Budget",
  CHECK_BUDGET: "📊 Check Budget",
} as const;

const MENU_KEY_MAP: Record<keyof typeof MENU, TranslationKey> = {
  BALANCE: "MENU_BALANCE",
  TODAY: "MENU_TODAY",
  MONTHLY: "MENU_MONTHLY",
  PREVIOUS_MONTH: "MENU_PREVIOUS_MONTH",
  YEARLY: "MENU_YEARLY",
  SET_BUDGET: "MENU_SET_BUDGET",
  CHECK_BUDGET: "MENU_CHECK_BUDGET",
};

export const isMenuCommand = (text: string, command: keyof typeof MENU): boolean => {
  const mmText = getTranslation("mm", MENU_KEY_MAP[command]);
  const enText = getTranslation("en", MENU_KEY_MAP[command]);
  return text === mmText || text === enText;
};
