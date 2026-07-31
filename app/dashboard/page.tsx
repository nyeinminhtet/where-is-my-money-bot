"use client";

import { useState, useEffect, useMemo } from "react";

export default function DashboardPage() {
  const [user] = useState<any>(() => {
    if (typeof window !== "undefined") {
      return (window as any).Telegram?.WebApp?.initDataUnsafe?.user ?? null;
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<{
    summary: { totalIncome: number; totalExpense: number; balance: number };
    transactions: any[];
  }>({
    summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
    transactions: [],
  });

  useEffect(() => {
    // 1. Telegram SDK UI Setup
    if (typeof window !== "undefined") {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
    }

    // 2. Async Self-Executing Function (IIFE) ဖြင့် Data လှမ်းဆွဲခြင်း
    let isMounted = true;

    async function loadData() {
      const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      const targetUserId = tgUser?.id || user?.id;

      if (!targetUserId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/expenses?telegramId=${targetUserId}`);
        const result = await res.json();

        if (isMounted && result.success) {
          setData({
            summary: result.summary,
            transactions: result.transactions,
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false; // Memory Leak & Unmounted State Update မဖြစ်အောင် တားခြင်း
    };
  }, [user]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: any[] } = {};

    data.transactions.forEach((tx) => {
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
  }, [data.transactions]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Where Is My Money
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome,{" "}
              <span className="text-emerald-400 font-medium">
                {user?.first_name || "User"}
              </span>{" "}
              👋
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Mini App
          </span>
        </div>

        {/* Financial Summary Card (Income / Expense / Balance) */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4 space-y-4 shadow-xl">
          <div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">
              Net Balance (လက်ကျန်ငွေ)
            </p>
            <p
              className={`text-3xl font-black tracking-tight mt-1 ${data.summary.balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
            >
              {loading ? "..." : `${data.summary.balance.toLocaleString()} Ks`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
            {/* Income */}
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-mono uppercase">
                Total Income
              </p>
              <p className="text-base font-bold text-emerald-300 mt-0.5">
                +{loading ? "..." : data.summary.totalIncome.toLocaleString()}{" "}
                Ks
              </p>
            </div>

            {/* Expense */}
            <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              <p className="text-[10px] text-rose-400 font-mono uppercase">
                Total Expense
              </p>
              <p className="text-base font-bold text-rose-300 mt-0.5">
                -{loading ? "..." : data.summary.totalExpense.toLocaleString()}{" "}
                Ks
              </p>
            </div>
          </div>
        </div>

        {/* Grouped Transactions List */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Transaction History
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-900/60 rounded-xl animate-pulse border border-slate-800/60"
                />
              ))}
            </div>
          ) : Object.keys(groupedTransactions).length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              စာရင်း မရှိသေးပါ။ Bot ထဲမှာ စာရင်းစရိုက်ကြည့်ပါ!
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([dateGroup, items]) => (
              <div key={dateGroup} className="space-y-2">
                {/* Date Group Header */}
                <div className="sticky top-0 bg-slate-950/90 backdrop-blur py-1 z-10 flex justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800/40">
                  <span>{dateGroup}</span>
                  <span className="text-[10px] text-slate-500">
                    {items.length} items
                  </span>
                </div>

                {/* Items in this date */}
                <div className="space-y-2">
                  {items.map((tx: any) => {
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
