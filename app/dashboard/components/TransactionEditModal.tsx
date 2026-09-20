"use client";

import { useEffect, useState } from "react";
import { Trash2, Save, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DEFAULT_CATEGORIES } from "@/constants/categories";
import {
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/lib/hooks/useExpenses";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TransactionFormValues,
  transactionSchema,
} from "@/lib/schema/transaction.schema";
import { useI18n } from "@/lib/hooks/useI18n";
import { getCategoryName } from "@/lib/helpers/category-translations";

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
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { lang, t } = useI18n();

  const { mutate: updateTx, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: deleteTx, isPending: isDeleting } = useDeleteTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (transaction && isOpen) {
      reset({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || "",
      });
    }
  }, [transaction, isOpen, reset]);

  const selectedType = useWatch({ control, name: "type" });
  const categoryOptions =
    DEFAULT_CATEGORIES[selectedType] || DEFAULT_CATEGORIES.EXPENSE;

  const handleTypeChange = (newType: "INCOME" | "EXPENSE") => {
    setValue("type", newType);
    const currentCategory = getValues("category");
    if (!DEFAULT_CATEGORIES[newType].includes(currentCategory)) {
      setValue("category", DEFAULT_CATEGORIES[newType][0]);
    }
  };

  const onSubmit = (data: TransactionFormValues) => {
    updateTx(
      {
        id: transaction.id,
        title: data.description || "",
        amount: data.amount,
        category: data.category,
        type: data.type,
      },
      { onSuccess: () => onClose() },
    );
  };

  const ConfirmDelete = () => {
    deleteTx(transaction.id, {
      onSuccess: () => {
        setShowDeleteAlert(false);
        onClose();
      },
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-slate-950 border-slate-800 max-w-[90vw] text-slate-100 sm:max-w-md rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-100">
              {t("EDIT_TRANSACTION")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              {t("DESCRIPTION_PROMPT")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => handleTypeChange("EXPENSE")}
                className={`py-1.5 text-xs outline-none cursor-pointer font-semibold rounded-lg transition ${
                  selectedType === "EXPENSE"
                    ? "bg-rose-500/20 text-rose-400 ring-1 ring-inset ring-rose-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("EXPENSE")} (-)
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("INCOME")}
                className={`py-1.5 text-xs outline-none cursor-pointer font-semibold rounded-lg transition ${
                  selectedType === "INCOME"
                    ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-inset ring-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("INCOME")} (+)
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">
                {t("AMOUNT")}
              </label>
              <Input
                type="number"
                placeholder="0"
                onPaste={(e) => {
                  if (/[eE+-]/.test(e.clipboardData.getData("text"))) {
                    e.preventDefault();
                  }
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                {...register("amount")}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl h-10 px-3 outline-none border border-slate-800 focus-visible:ring-slate-700 transition"
              />
              {errors.amount && (
                <p className="text-[10px] text-rose-400 pl-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">
                {t("CATEGORY")}
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-slate-200 text-sm rounded-xl h-10 focus:ring-slate-700">
                      {/* 💡 field.value ရှိရင် getCategoryName ဖြင့် Localized English Label ကို ပြပေးမည် */}
                      <SelectValue placeholder={t("SELECT_CATEGORY")}>
                        {field.value
                          ? getCategoryName(field.value, lang, t)
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-xl">
                      {categoryOptions.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="text-xs text-slate-200 cursor-pointer rounded-lg hover:bg-slate-800 focus:bg-slate-800 focus:text-slate-100 data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-100"
                        >
                          {getCategoryName(cat, lang, t)}
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

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">
                {t("DESCRIPTION")}
              </label>
              <Input
                type="text"
                placeholder="..."
                {...register("description")}
                className="w-full bg-slate-900 text-slate-200 text-xs rounded-xl h-10 px-3 outline-none border border-slate-800 focus-visible:ring-slate-700 transition"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAlert(true)}
                disabled={isDeleting || isUpdating}
                className="flex-1 bg-rose-500/10 cursor-pointer hover:bg-rose-500/20 text-rose-400 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition border border-rose-500/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                {isDeleting ? "..." : t("DELETE")}
              </button>

              <button
                type="submit"
                disabled={isDeleting || isUpdating}
                className="flex-2 cursor-pointer bg-slate-200 hover:bg-white text-slate-950 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {isUpdating ? "..." : t("SAVE")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-[90vw] sm:max-w-sm rounded-2xl p-5 overflow-hidden">
          <AlertDialogHeader className="space-y-1 text-left">
            <AlertDialogTitle className="text-base font-semibold text-slate-100">
              {t("DELETE_CONFIRM_TITLE")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-400 leading-relaxed">
              {t("DELETE_CONFIRM_MESSAGE")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row items-center justify-end gap-2 pt-4 bg-transparent border-t-0 sm:space-x-0">
            <AlertDialogCancel className="mt-0 h-9 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 border-slate-800 text-xs font-medium rounded-xl px-4 transition cursor-pointer">
              {t("CANCEL")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={ConfirmDelete}
              disabled={isDeleting}
              className="h-9 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl px-4 transition border-0 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? "..." : t("DELETE")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionEditModal;
