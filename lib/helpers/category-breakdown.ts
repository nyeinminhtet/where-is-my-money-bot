import { formatCurrency } from "@/utils/formatCurrency";

interface CategorySumItem {
  category: string;
  _sum: { amount: number | null };
}

interface CategoryBreakdownInput {
  categoryIncomes?: CategorySumItem[] | null;
  categoryExpenses?: CategorySumItem[] | null;
  income: number;
  expense: number;
}

const formatCategoryLines = (
  items: CategorySumItem[] | null | undefined,
  total: number,
  symbol: string,
  header: string,
): string[] => {
  if (!items || items.length === 0) return [];
  return [
    "",
    header,
    ...items.map((item) => {
      const amount = item._sum.amount ?? 0;
      const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
      return `${symbol} ${item.category} - ${formatCurrency(amount)} (${percentage}%)`;
    }),
  ];
};

export const buildCategoryBreakdownLines = (
  input: CategoryBreakdownInput,
): string[] => {
  const { categoryIncomes, categoryExpenses, income, expense } = input;
  const incomeLines = formatCategoryLines(
    categoryIncomes,
    income,
    "🔸",
    "--- 💰 ဝင်ငွေ ရရှိသော ကဏ္ဍများ ---",
  );
  const expenseLines = formatCategoryLines(
    categoryExpenses,
    expense,
    "🔹",
    "--- 📂 အသုံးများသော ကဏ္ဍများ ---",
  );
  return [...incomeLines, ...expenseLines];
};
