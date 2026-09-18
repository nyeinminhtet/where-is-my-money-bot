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

export const isMenuCommand = (text: string, command: keyof typeof MENU): boolean => {
  return text === MENU[command] || text === MENU_EN[command];
};
