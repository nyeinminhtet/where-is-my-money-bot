"use client";

import { useState } from "react";
import { Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_CATEGORIES } from "@/constants/categories";
import {
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/lib/hooks/useExpenses";

interface TransactionEditModalProps {
  transaction: {
    id: string;
    description?: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const TransactionEditModal = ({
  transaction,
  isOpen,
  onClose,
}: TransactionEditModalProps) => {
  const [description, setDescription] = useState(transaction.description || "");
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [type, setType] = useState<"INCOME" | "EXPENSE">(transaction.type);

  const { mutate: updateTx, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: deleteTx, isPending: isDeleting } = useDeleteTransaction();

  // Type ပြောင်းရင် သက်ဆိုင်ရာ Category မဟုတ်တော့ပါက First Category ကို Default ထားပေးမည်
  const handleTypeChange = (newType: "INCOME" | "EXPENSE") => {
    setType(newType);
    if (!DEFAULT_CATEGORIES[newType].includes(category)) {
      setCategory(DEFAULT_CATEGORIES[newType][0]);
    }
  };

  // Save (Update) Handling
  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return;

    updateTx(
      {
        id: transaction.id,
        title: description,
        amount: Number(amount),
        category,
        type,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  // Delete Handling
  const handleDelete = () => {
    if (confirm("ဒီစာရင်းကို ဖျက်ရန် သေချာပါသလား?")) {
      deleteTx(transaction.id, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-md rounded-2xl p-5">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-100">
            စာရင်း ပြင်ဆင်/ဖျက်မည်
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            စာရင်းအချက်အလက်များကို ပြင်ဆင်ပြီးပါက သိမ်းဆည်းမည် ကို နှိပ်ပါ။
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Income / Expense Toggle */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => handleTypeChange("EXPENSE")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                type === "EXPENSE"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ထွက်ငွေ (Expense)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("INCOME")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                type === "INCOME"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ဝင်ငွေ (Income)
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">
              ပမာဏ (Ks)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-900 text-slate-200 font-mono text-xs rounded-xl px-3 py-2.5 outline-none border border-slate-800 focus:border-slate-600 transition"
            />
          </div>

          {/* Category Select Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">
              ကဏ္ဍ (Category)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none border border-slate-800 focus:border-slate-600 transition appearance-none cursor-pointer"
            >
              {DEFAULT_CATEGORIES[type].map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-slate-900 text-slate-200"
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">
              မှတ်ချက် / ခေါင်းစဉ်
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="မှတ်ချက် ထည့်ပါ..."
              className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none border border-slate-800 focus:border-slate-600 transition"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition border border-rose-500/20 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? "ဖျက်နေသည်..." : "ဖျက်မည်"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isDeleting || isUpdating}
            className="flex-[2] bg-slate-200 hover:bg-white text-slate-950 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isUpdating ? "သိမ်းနေသည်..." : "ပြင်ဆင်မည်"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditModal;
