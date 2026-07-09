import { TransactionType } from "@/generated/prisma/client";

export const DEFAULT_CATEGORIES: Record<TransactionType, string[]> = {
  INCOME: ["Salary", "Business", "Freelance", "Gift", "Investment", "Other"],
  EXPENSE: [
    "Food",
    "Transport",
    "Rent",
    "Utilities",
    "Health",
    "Shopping",
    "Education",
    "Entertainment",
    "Family",
    "Other",
  ],
};

export const CATEGORY_BUTTONS_PER_ROW = 2;
