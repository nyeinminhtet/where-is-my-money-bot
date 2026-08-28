import type { Transaction } from "@/generated/prisma/client";
import { formatCurrency } from "@/utils/formatCurrency";
import { DEFAULT_CATEGORY } from "@/constants/categories";

export const getTypeText = (type: "INCOME" | "EXPENSE"): string =>
  type === "INCOME" ? "ဝင်ငွေ" : "ထွက်ငွေ";

export const getDescriptionText = (description: string | null): string =>
  description ? description : "မရှိပါ";

export const normalizeCategory = (category?: string | null): string =>
  category ? category : DEFAULT_CATEGORY;

interface TransactionSummaryOptions {
  header: string;
  includeBalance?: number;
  carriedForwardBalance?: number;
  parseMode?: "Markdown" | "HTML";
}

export const buildTransactionSummaryMessage = (
  transaction: Transaction,
  options: TransactionSummaryOptions,
): string => {
  const lines = [
    options.header,
    "",
    `📌 အမျိုးအစား - ${getTypeText(transaction.type)}`,
    `📂 ကဏ္ဍ - ${transaction.category}`,
    `💰 ပမာဏ - ${formatCurrency(transaction.amount)}`,
    `📝 မှတ်ချက် - ${getDescriptionText(transaction.description)}`,
  ];

  if (typeof options.includeBalance === "number") {
    lines.push("", `💵 **လက်ကျန်ငွေ - ${formatCurrency(options.includeBalance)}**`);
  }

  if (
    typeof options.carriedForwardBalance === "number" &&
    options.carriedForwardBalance !== 0
  ) {
    lines.push(
      `*(ယခင်လများမှ ကျန်ငွေ: ${formatCurrency(options.carriedForwardBalance)})*`,
    );
  }

  return lines.join("\n");
};
