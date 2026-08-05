import * as z from "zod";

// Zod Validation Schema
export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.coerce
    .number<number>({ message: "ပမာဏ ထည့်ပါ" })
    .min(1, "ပမာဏသည် အနည်းဆုံး ၁ ကျပ် ရှိရပါမည်"),
  category: z.string().min(1, "ကဏ္ဍ ရွေးချယ်ပါ"),
  description: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
