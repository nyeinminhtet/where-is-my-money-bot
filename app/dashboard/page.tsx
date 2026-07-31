"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [user] = useState<any>(() => {
    if (typeof window !== "undefined") {
      return (window as any).Telegram?.WebApp?.initDataUnsafe?.user ?? null;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
    }
  }, []);

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

        {/* Total Spent Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-5 space-y-2 shadow-xl shadow-black/40">
          <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
            Total Spent (July 2026)
          </p>

          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white tracking-tight">
              45,500{" "}
              <span className="text-sm font-normal text-slate-400">Ks</span>
            </p>
            <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              +12% vs last mo
            </span>
          </div>
        </div>

        {/* Recent Expenses List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Recent Expenses
            </h2>
            <button className="text-xs text-emerald-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60 hover:border-slate-700 transition">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 text-sm">
                  🥤
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Cocala အချိုရည်
                  </p>
                  <p className="text-xs text-slate-500">
                    Today, 2:57 PM • အစားအသောက်
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-rose-400 font-mono">
                -1,300 Ks
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60 hover:border-slate-700 transition">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
                  🍜
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">မနက်စာ</p>
                  <p className="text-xs text-slate-500">
                    Today, 9:00 AM • အစားအသောက်
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-rose-400 font-mono">
                -4,500 Ks
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
