"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

type TransactionItem = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
};

type ExpensesResponse = {
  success: boolean;
  summary: TransactionSummary;
  transactions: TransactionItem[];
};

export default function DashboardPage() {
  const [user] = useState(() => {
    if (typeof window !== "undefined") {
      const telegramWindow = window as Window & {
        Telegram?: {
          WebApp?: {
            initDataUnsafe?: {
              user?: {
                id?: number;
                first_name?: string;
              };
            };
          };
        };
      };

      return telegramWindow.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const telegramWindow = window as Window & {
        Telegram?: {
          WebApp?: {
            ready: () => void;
            expand: () => void;
          };
        };
      };

      telegramWindow.Telegram?.WebApp?.ready?.();
      telegramWindow.Telegram?.WebApp?.expand?.();
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const { data, isLoading, isError, error } = useQuery<ExpensesResponse>({
    queryKey: ["expenses", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return {
          success: true,
          summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
          transactions: [],
        };
      }

      const response = await fetch(`/api/expenses?telegramId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to load expenses");
      }
      return response.json();
    },
    enabled: Boolean(user?.id),
  });

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, TransactionItem[]> = {};

    (data?.transactions ?? []).forEach((tx) => {
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
    });

    return groups;
  }, [data?.transactions]);

  const summary = data?.summary ?? {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-md mx-auto space-y-5">
        <div className="border-b border-slate-800/80 pb-3">
          <p className="text-base font-medium text-slate-300">
            {getGreeting()},{" "}
            <span className="text-emerald-400 font-bold">
              {user?.first_name || "User"}
            </span>{" "}
            👋
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4 space-y-4 shadow-xl">
          <div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">
              Net Balance (လက်ကျန်ငွေ)
            </p>
            <p
              className={`text-3xl font-black tracking-tight mt-1 ${summary.balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
            >
              {isLoading ? "..." : `${summary.balance.toLocaleString()} Ks`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-mono uppercase">
                Total Income
              </p>
              <p className="text-base font-bold text-emerald-300 mt-0.5">
                +{isLoading ? "..." : summary.totalIncome.toLocaleString()} Ks
              </p>
            </div>

            <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              <p className="text-[10px] text-rose-400 font-mono uppercase">
                Total Expense
              </p>
              <p className="text-base font-bold text-rose-300 mt-0.5">
                -{isLoading ? "..." : summary.totalExpense.toLocaleString()} Ks
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Transaction History
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-900/60 rounded-xl animate-pulse border border-slate-800/60"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">
              {(error as Error)?.message || "Unable to load transactions."}
            </div>
          ) : Object.keys(groupedTransactions).length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              စာရင်း မရှိသေးပါ။ Bot ထဲမှာ စာရင်းစရိုက်ကြည့်ပါ!
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([dateGroup, items]) => (
              <div key={dateGroup} className="space-y-2">
                <div className="sticky top-0 bg-slate-950/90 backdrop-blur py-1 z-10 flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800/40">
                  <span>{dateGroup}</span>
                  <span className="text-[10px] text-slate-500">
                    {items.length} items
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((tx) => {
                    const isIncome = tx.type === "INCOME";
                    const txTime = new Date(tx.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );

                    return (
                      <div
                        key={tx.id}
                        className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${
                              isIncome
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            }`}
                          >
                            {isIncome ? "⇣" : "⇡"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200">
                              {tx.title}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {txTime} • {tx.category}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-sm font-bold font-mono ${
                            isIncome ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {tx.amount.toLocaleString()} Ks
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
