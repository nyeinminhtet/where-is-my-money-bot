import type { Transaction } from "@/generated/prisma/client";
import { formatCurrency } from "@/utils/formatCurrency";
import { DEFAULT_CATEGORY } from "@/constants/categories";
import { getTranslation, type Locale } from "@/lib/i18n";

export const getTypeText = (type: "INCOME" | "EXPENSE", lang: Locale = "mm"): string =>
  type === "INCOME"
    ? getTranslation(lang, "TYPE_INCOME")
    : getTranslation(lang, "TYPE_EXPENSE");

export const getDescriptionText = (description: string | null, lang: Locale = "mm"): string =>
  description ? description : getTranslation(lang, "NOTE_NONE");

export const normalizeCategory = (category?: string | null): string =>
  category ? category : DEFAULT_CATEGORY;

interface TransactionSummaryOptions {
  header: string;
  includeBalance?: number;
  carriedForwardBalance?: number;
  parseMode?: "Markdown" | "HTML";
  language?: Locale;
}

export const buildTransactionSummaryMessage = (
  transaction: Transaction,
  options: TransactionSummaryOptions,
): string => {
  const lang = options.language || "mm";

  const lines = [
    options.header,
    "",
    getTranslation(lang, "TX_TYPE", { type: getTypeText(transaction.type, lang) }),
    getTranslation(lang, "TX_CATEGORY", { category: transaction.category }),
    getTranslation(lang, "TX_AMOUNT", { amount: formatCurrency(transaction.amount) }),
    getTranslation(lang, "TX_NOTE", { note: getDescriptionText(transaction.description, lang) }),
  ];

  if (typeof options.includeBalance === "number") {
    lines.push("", getTranslation(lang, "TX_BALANCE", { amount: formatCurrency(options.includeBalance) }));
  }

  if (
    typeof options.carriedForwardBalance === "number" &&
    options.carriedForwardBalance !== 0
  ) {
    lines.push(
      getTranslation(lang, "TX_CARRIED_FORWARD", { amount: formatCurrency(options.carriedForwardBalance) }),
    );
  }

  return lines.join("\n");
};
