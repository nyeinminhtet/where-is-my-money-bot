import { formatCurrency } from "@/utils/formatCurrency";
import { getTranslation, type Locale } from "@/lib/i18n";

interface BudgetStatusInput {
  totalExpense: number;
  budget: number;
}

export const getBudgetWarningText = ({
  totalExpense,
  budget,
}: BudgetStatusInput): string => {
  if (totalExpense >= budget) return "\n\nBUDGET_WARNING_100";
  if (totalExpense >= budget * 0.8) return "\n\nBUDGET_WARNING_80";
  return "";
};

export const getBudgetStatusMessage = ({
  totalExpense,
  budget,
}: BudgetStatusInput, lang: Locale = "mm"): string => {
  const percentageUsed = ((totalExpense / budget) * 100).toFixed(1);
  const remainingBudget = budget - totalExpense;

  const budgetMessage = [
    getTranslation(lang, "BUDGET_STATUS_HEADER"),
    getTranslation(lang, "BUDGET_STATUS_BUDGET", { amount: formatCurrency(budget) }),
    getTranslation(lang, "BUDGET_STATUS_USED", { amount: formatCurrency(totalExpense), percent: percentageUsed }),
    getTranslation(lang, "BUDGET_STATUS_REMAINING", { amount: formatCurrency(remainingBudget >= 0 ? remainingBudget : 0) }),
  ].join("\n");

  const warningText = getBudgetWarningText({ totalExpense, budget });
  let warning = "";
  if (warningText === "\n\nBUDGET_WARNING_100") {
    warning = getTranslation(lang, "BUDGET_WARNING_100");
  } else if (warningText === "\n\nBUDGET_WARNING_80") {
    warning = getTranslation(lang, "BUDGET_WARNING_80");
  }

  return `${budgetMessage}${warning}`;
};

export const getBudgetWarningMessage = ({
  totalExpense,
  budget,
}: BudgetStatusInput, lang: Locale = "mm"): string => {
  const percentageUsed = ((totalExpense / budget) * 100).toFixed(1);

  let warning = "";
  const warningText = getBudgetWarningText({ totalExpense, budget });
  if (warningText === "\n\nBUDGET_WARNING_100") {
    warning = getTranslation(lang, "BUDGET_WARNING_100");
  } else if (warningText === "\n\nBUDGET_WARNING_80") {
    warning = getTranslation(lang, "BUDGET_WARNING_80");
  }

  return [
    getTranslation(lang, "BUDGET_HEADER"),
    getTranslation(lang, "BUDGET_USED_LINE", { amount: formatCurrency(totalExpense), budget: formatCurrency(budget), percent: percentageUsed }),
    warning,
  ].join("\n");
};
