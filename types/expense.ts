export type TransactionSummary = {
  carriedForwardBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalNetBalance: number;
  balance?: number;
};

export type TransactionItem = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
};

export type CategoryBreakdownItem = {
  category: string;
  amount: number;
};

export type ExpensesResponse = {
  success: boolean;
  summary: TransactionSummary;
  transactions: TransactionItem[];
  breakdown: CategoryBreakdownItem[];
  monthlyBudget?: number | null;
};
