import type {
  BotSession,
  SessionState,
  TransactionType,
  User,
} from "@/generated/prisma/client";
import type {
  TelegramCallbackQuery,
  TelegramGateway,
  TelegramMessage,
  TelegramUpdate,
  TelegramUser,
} from "./telegram";

export type MoneySummary = {
  income: number;
  expense: number;
  net: number;
};

export type CategorySummary = {
  category: string;
  income: number;
  expense: number;
  net: number;
  count: number;
};

export type PeriodSummary = {
  label: string;
  totals: MoneySummary;
};

export type DetailedPeriodSummary = PeriodSummary & {
  categories: CategorySummary[];
};

export type BotRuntimeContext = {
  update: TelegramUpdate;
  chatId: number;
  from: TelegramUser;
  text: string;
  user: User;
  session: BotSession;
  message?: TelegramMessage;
  callbackQuery?: TelegramCallbackQuery;
  telegram: TelegramGateway;
};

export type BotStateContext = BotRuntimeContext & {
  sessionState: SessionState;
};

export type DraftTransaction = {
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
};
