import { MENU } from "@/constants/menu";
import type {
  TelegramInlineKeyboardButton,
  TelegramInlineKeyboardMarkup,
} from "@/types/telegram";

export function typeKeyboard(): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: "💰 ဝင်ငွေ",
          callback_data: "TYPE_INCOME",
        },
        {
          text: "💸 ထွက်ငွေ",
          callback_data: "TYPE_EXPENSE",
        },
      ],
    ],
  };
}

export function categoryKeyboard(
  categories: string[],
): TelegramInlineKeyboardMarkup {
  const inlineKeyboard: TelegramInlineKeyboardButton[][] = [];
  const buttonsPerRow = 2;

  for (let i = 0; i < categories.length; i += buttonsPerRow) {
    const row = categories.slice(i, i + buttonsPerRow).map((category) => {
      const originalIndex = categories.indexOf(category);

      return {
        text: category,
        callback_data: `CATEGORY_${originalIndex}`,
      };
    });

    inlineKeyboard.push(row);
  }

  return {
    inline_keyboard: inlineKeyboard,
  };
}

export function undoKeyboard(transactionId: string) {
  return {
    inline_keyboard: [
      [{ text: "🗑️ ပြန်ဖျက်မည်", callback_data: `UNDO_${transactionId}` }],
    ],
  };
}

export function backKeyboard(): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: "⬅️ Back",
          callback_data: "BACK",
        },
      ],
    ],
  };
}

export function mainMenuKeyboard() {
  return {
    keyboard: [
      [
        {
          text: MENU.BALANCE,
        },
        {
          text: MENU.TODAY,
        },
      ],
      [
        {
          text: MENU.MONTHLY,
        },
        {
          text: MENU.PREVIOUS_MONTH,
        },
      ],
      [
        {
          text: MENU.YEARLY,
        },
      ],
    ],
    resize_keyboard: true,
    persistent_keyboard: true,
  };
}
