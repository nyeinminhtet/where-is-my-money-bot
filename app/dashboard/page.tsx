"use client";

import { useEffect, useState } from "react";

const DashboardPage = () => {
  // 🔽 Initial State သတ်မှတ်ကတည်းက Window / Telegram Data ကို တန်းယူခြင်း
  const [user] = useState<any>(() => {
    if (typeof window !== "undefined") {
      return (window as any).Telegram?.WebApp?.initDataUnsafe?.user ?? null;
    }
    return null;
  });

  useEffect(() => {
    // useEffect ထဲမှာ Telegram SDK ရဲ့ Ready/Expand UI Logic တွေကိုပဲ သီးသန့် အလုပ်လုပ်ခိုင်းခြင်း
    if (typeof window !== "undefined") {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-4 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-xl font-bold">Where Is My Money</h1>
            <p className="text-xs text-neutral-400">
              Welcome, {user?.first_name || "User"} 👋
            </p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Live Demo
          </span>
        </div>

        {/* Dummy Expense Summary Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
          <p className="text-xs text-neutral-400 uppercase font-mono">
            Total Spent (July 2026)
          </p>
          <p className="text-3xl font-extrabold text-white">45,500 Ks</p>
        </div>

        {/* Quick Recent Transactions Placeholder */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-300">
            Recent Expenses
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-neutral-900/50 p-3 rounded-xl border border-neutral-800/80">
              <div>
                <p className="text-sm font-medium">Cocala အချိုရည်</p>
                <p className="text-xs text-neutral-500">
                  Today, 2:57 PM • အစားအသောက်
                </p>
              </div>
              <span className="text-sm font-bold text-rose-400">-1,300 Ks</span>
            </div>
            <div className="flex justify-between items-center bg-neutral-900/50 p-3 rounded-xl border border-neutral-800/80">
              <div>
                <p className="text-sm font-medium">မနက်စာ</p>
                <p className="text-xs text-neutral-500">
                  Today, 9:00 AM • အစားအသောက်
                </p>
              </div>
              <span className="text-sm font-bold text-rose-400">-4,500 Ks</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
