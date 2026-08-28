"use client";

import { useState, useMemo } from "react";
import { ChevronRight, Search, X } from "lucide-react";

import TransactionEditModal from "./TransactionEditModal";
import { DEFAULT_CATEGORIES } from "@/constants/categories";
import { Input } from "@/components/ui/input";

type TransactionItem = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
};

type TransactionListProps = {
  transactions: TransactionItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

const CATEGORY_OPTIONS = [
  "ALL",
  ...Array.from(
    new Set([...DEFAULT_CATEGORIES.INCOME, ...DEFAULT_CATEGORIES.EXPENSE]),
  ),
];

const TransactionList = ({
  transactions,
  isLoading,
  isError,
  errorMessage,
}: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionItem | null>(null);

  // Search and static category filtering logic.
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || tx.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, selectedCategory]);

  // 4. Date Grouping Logic
  const groupedTransactions = filteredTransactions.reduce<
    Record<string, TransactionItem[]>
  >((groups, tx) => {
    const date = new Date(tx.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let dateKey = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (date.toDateString() === today.toDateString()) {
      dateKey = "Today (ယနေ့)";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Yesterday (မနေ့က)";
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(tx);

    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 bg-slate-900/60 rounded-xl animate-pulse border border-slate-800/60"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">
        {errorMessage || "Unable to load transactions."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🔍 Search Bar & Static Category Chips */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md pt-2 pb-2 -mx-1 px-1 border-b border-slate-900/80">
        <div className="space-y-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="စာရင်းများ ရှာဖွေပါ..."
              className="w-full bg-slate-900/60 text-slate-200 text-xs rounded-xl pl-9 pr-8 py-2.5 h-auto border-slate-800/60 focus-visible:ring-1 focus-visible:ring-slate-600 focus-visible:ring-offset-0 placeholder:text-slate-500 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded-md transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Static Category Chips Bar */}
          <div className="flex gap-1.5 overflow-x-auto overscroll-x-contain pb-1.5 pt-0.5 no-scrollbar touch-pan-x min-h-9.5 items-center">
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border select-none shrink-0 ${
                    isSelected
                      ? "bg-slate-200 text-slate-950 border-slate-200"
                      : "bg-slate-900/60 text-slate-400 border-slate-800/60 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {cat === "ALL" ? "အားလုံး" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 📋 Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs">
          {searchTerm || selectedCategory !== "ALL"
            ? "ရှာဖွေထားသော စာရင်း မရှိပါ။"
            : "စာရင်း မရှိသေးပါ။ Bot ထဲမှာ စာရင်းစရိုက်ကြည့်ပါ!"}
        </div>
      ) : (
        Object.entries(groupedTransactions).map(([dateGroup, items]) => (
          <div key={dateGroup} className="space-y-2">
            <div className="sticky top-[95px] z-10 bg-slate-950/90 backdrop-blur-sm py-1 flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800/40">
              <span>{dateGroup}</span>
              <span className="text-[10px] text-slate-500">
                {items.length} items
              </span>
            </div>

            <div className="space-y-2">
              {items.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const txTime = new Date(tx.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="flex justify-between items-center bg-slate-900/60 hover:bg-slate-900 p-3 rounded-xl border border-slate-800/60 hover:border-slate-700 active:bg-slate-800/80 active:scale-[0.98] transition-all cursor-pointer group select-none"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border shrink-0 ${
                          isIncome
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}
                      >
                        {isIncome ? "⇣" : "⇡"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">
                          {tx.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {txTime} • {tx.category}
                        </p>
                      </div>
                    </div>

                    {/* Amount & Indicator Wrapper */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`text-sm font-bold font-mono ${
                          isIncome ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {tx.amount.toLocaleString()} Ks
                      </span>
                      {/* Mobile affordance visual cue */}
                      <ChevronRight className="w-4 h-4 text-slate-400/80 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* ✏️ Transaction Edit Modal */}
      {selectedTransaction && (
        <TransactionEditModal
          isOpen={!!selectedTransaction}
          transaction={{
            id: selectedTransaction.id,
            description: selectedTransaction.title,
            amount: selectedTransaction.amount,
            category: selectedTransaction.category,
            type: selectedTransaction.type,
          }}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionList;
