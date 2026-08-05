"use client";

import { useEffect, useMemo, useState } from "react";

import AnalyticsView from "./components/AnalyticsView";
import Header from "./components/Header";
import MonthlyBudgetCard from "./components/MonthlyBudgetCard";
import MonthSelector from "./components/MonthSelector";
import SummaryCards from "./components/SummaryCards";
import TransactionList from "./components/TransactionList";
import ViewTabs from "./components/ViewTabs";
import { useExpenses } from "@/lib/hooks/useExpenses";
import CreateTransactionModal from "./components/CreateTransactionModal";

const DashboardPage = () => {
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

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });
  const [activeTab, setActiveTab] = useState<"history" | "analytics">(
    "history",
  );

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

  const { data, isLoading, isError, error } = useExpenses(
    user as { id: number },
    selectedDate,
  );

  const summary = useMemo(
    () =>
      data?.summary ?? {
        carriedForwardBalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalNetBalance: 0,
        balance: 0,
      },
    [data?.summary],
  );

  const handlePrevMonth = () => {
    setSelectedDate((current) => {
      if (current.month === 1) {
        return { month: 12, year: current.year - 1 };
      }
      return { month: current.month - 1, year: current.year };
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((current) => {
      if (current.month === 12) {
        return { month: 1, year: current.year + 1 };
      }
      return { month: current.month + 1, year: current.year };
    });
  };

  const handleSelectDate = (year: number, month: number) => {
    setSelectedDate({ year, month });
  };

  return (
    <main className="min-h-screen relative bg-slate-950 text-slate-100 p-4 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <Header name={user?.first_name || "User"} />

        <MonthSelector
          month={selectedDate.month}
          year={selectedDate.year}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          onSelectDate={handleSelectDate}
        />
        <SummaryCards
          totalNetBalance={summary.totalNetBalance}
          carriedForwardBalance={summary.carriedForwardBalance}
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
          isLoading={isLoading}
        />

        {/* 👈 3. Budget Card ကို ဒီနေရာမှာ ထည့်ပေးထားပါတယ် */}
        <MonthlyBudgetCard
          monthlyBudget={data?.monthlyBudget ?? null}
          totalExpense={summary.totalExpense}
          isLoading={isLoading}
        />

        <ViewTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "history" ? (
          <TransactionList
            transactions={data?.transactions ?? []}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as Error)?.message}
          />
        ) : (
          <AnalyticsView
            breakdown={data?.breakdown ?? []}
            isLoading={isLoading}
          />
        )}
      </div>
      <CreateTransactionModal userId={String(user?.id as number)} />
    </main>
  );
};

export default DashboardPage;
