"use client";

import { useState } from "react";

import { Loader2, PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TransactionFormValues,
  transactionSchema,
} from "@/lib/schema/transaction.schema";
import { DEFAULT_CATEGORIES } from "@/constants/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTransactionModalProps {
  userId: number | string;
}

const createTransactionApi = async (payload: {
  userId: number | string;
  amount: number;
  type: "EXPENSE" | "INCOME";
  category: string;
  description: string;
}) => {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create transaction");
  }

  return res.json();
};

const CreateTransactionModal = ({ userId }: CreateTransactionModalProps) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: 0,
      category: "",
      description: "",
    },
    mode: "onChange",
  });

  const selectedType = useWatch({ control, name: "type" });
  const categoryOptions =
    DEFAULT_CATEGORIES[selectedType] || DEFAULT_CATEGORIES.EXPENSE;

  const createMutation = useMutation({
    mutationFn: createTransactionApi,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
      ]);
      setOpen(false);
      reset();
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    createMutation.mutate({
      userId,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description || "",
    });
  };

  const handleTypeChange = (newType: "EXPENSE" | "INCOME") => {
    setValue("type", newType);
    setValue("category", DEFAULT_CATEGORIES[newType][0]); // အသစ်ပြောင်းသွားသော type ရဲ့ ပထမဆုံး category ကို Auto Select မှတ်မည်
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen((v) => !v);
        reset();
      }}
    >
      {/* 📍 Bottom Right Floating Action Button (FAB) */}
      <DialogTrigger>
        <Button
          type="button"
          size={"icon"}
          aria-label="Add Transaction"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-13 h-13 rounded-full bg-slate-200 text-slate-950 shadow-lg shadow-slate-950/50 hover:bg-white active:scale-95 transition-all duration-200"
        >
          <PlusIcon className="size-7" />
        </Button>
      </DialogTrigger>

      {/* 📋 Create Transaction Modal (Shadcn Dialog) */}
      <DialogContent className="sm:max-w-106.25 bg-slate-950 border-slate-800 text-slate-100 rounded-2xl p-5">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-200">
            စာရင်းအသစ် ထည့်သွင်းရန်
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Income / Expense Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange("EXPENSE")}
              className={`py-2 text-xs outline-none cursor-pointer font-semibold rounded-lg transition-colors ${
                selectedType === "EXPENSE"
                  ? "bg-rose-500/20 text-rose-400 ring-1 ring-inset ring-rose-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ထွက်ငွေ (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("INCOME")}
              className={`py-2 text-xs outline-none cursor-pointer font-semibold rounded-lg transition-colors  ${
                selectedType === "INCOME"
                  ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-inset ring-emerald-500/30"
                  : " text-slate-400 hover:text-slate-200"
              }`}
            >
              ဝင်ငွေ (+)
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">ပမာဏ (ကျပ်)</label>
            <Input
              type="number"
              placeholder="0"
              onPaste={(e) => {
                const pasteData = e.clipboardData.getData("text");
                if (/[eE+-]/.test(pasteData)) {
                  e.preventDefault();
                }
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              {...register("amount")}
              className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-slate-700 text-sm rounded-xl h-10"
            />
            {errors.amount && (
              <p className="text-[10px] text-rose-400 pl-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Category Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              ကဏ္ဍ (Category)
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-slate-100 text-sm rounded-xl h-10 focus:ring-slate-700">
                    <SelectValue placeholder="ကဏ္ဍ ရွေးပါ" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-xl">
                    {categoryOptions.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-xs text-slate-200 cursor-pointer rounded-lg hover:bg-slate-800 focus:bg-slate-800 focus:text-slate-100 data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-100"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-[10px] text-rose-400 pl-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">
              မှတ်ချက် (Optional)
            </label>
            <Input
              type="text"
              placeholder="အသေးစိတ် မှတ်ချက်..."
              {...register("description")}
              className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-slate-700 text-sm rounded-xl h-10"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-slate-200 text-slate-950 hover:bg-white font-semibold text-xs rounded-xl h-10 mt-2 transition"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              "စာရင်းသိမ်းမည်"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal;
