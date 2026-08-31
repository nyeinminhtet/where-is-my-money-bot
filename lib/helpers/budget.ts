import { formatCurrency } from "@/utils/formatCurrency";

interface BudgetStatusInput {
  totalExpense: number;
  budget: number;
}

const WARNING_80 =
  "\n\n⚠️ **သတိပေးချက်:** ဒီလ Budget ရဲ့ 80% ကျော်သွားပါပြီ။ သတိထားသုံးစွဲပေးပါဦး။";
const WARNING_100 =
  "\n\n🚨 **သတိပေးချက်:** ဒီလအတွက် သတ်မှတ်ထားတဲ့ Budget ပြည့်/ကျော်သွားပါပြီ။ 📉";

export const getBudgetWarningText = ({
  totalExpense,
  budget,
}: BudgetStatusInput): string => {
  if (totalExpense >= budget) return WARNING_100;
  if (totalExpense >= budget * 0.8) return WARNING_80;
  return "";
};

export const getBudgetStatusMessage = ({
  totalExpense,
  budget,
}: BudgetStatusInput): string => {
  const percentageUsed = ((totalExpense / budget) * 100).toFixed(1);
  const remainingBudget = budget - totalExpense;
  const budgetMessage = [
    `📊 **သင်၏ လစဉ် အသုံးစရိတ် အခြေအနေ**`,
    "---------------------------------",
    `💰 သတ်မှတ်ထားသော အသုံးစရိတ်  : ${formatCurrency(budget)}`,
    `📉 အသုံးပြုပြီးသမျှ : ${formatCurrency(totalExpense)} (${percentageUsed}%)`,
    `💵 ကျန်ရှိငွေ        : ${formatCurrency(remainingBudget >= 0 ? remainingBudget : 0)}`,
  ].join("\n");
  return `${budgetMessage}${getBudgetWarningText({ totalExpense, budget })}`;
};

export const getBudgetWarningMessage = ({
  totalExpense,
  budget,
}: BudgetStatusInput): string => {
  const percentageUsed = ((totalExpense / budget) * 100).toFixed(1);
  const warningText = getBudgetWarningText({ totalExpense, budget });
  return [
    `📊 **လစဉ် Budget အခြေအနေ:**`,
    `- သုံးပြီးသမျှ: ${formatCurrency(totalExpense)} / ${formatCurrency(budget)} (${percentageUsed}%)`,
    warningText,
  ].join("\n");
};
