"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import AnalyticsView from "./components/AnalyticsView";
import Header from "./components/Header";
import MonthSelector from "./components/MonthSelector";
import SummaryCards from "./components/SummaryCards";
import TransactionList from "./components/TransactionList";
import ViewTabs from "./components/ViewTabs";

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

type CategoryBreakdownItem = {
  category: string;
  amount: number;
};

type ExpensesResponse = {
  success: boolean;
  summary: TransactionSummary;
  transactions: TransactionItem[];
  breakdown: CategoryBreakdownItem[];
};

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

  const { data, isLoading, isError, error } = useQuery<ExpensesResponse>({
    queryKey: ["expenses", user?.id, selectedDate.month, selectedDate.year],
    queryFn: async () => {
      if (!user?.id) {
        return {
          success: true,
          summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
          transactions: [],
          breakdown: [],
        };
      }

      const response = await fetch(
        `/api/expenses?telegramId=${user.id}&month=${selectedDate.month}&year=${selectedDate.year}`,
      );
      if (!response.ok) {
        throw new Error("Failed to load expenses");
      }
      return response.json();
    },
    enabled: Boolean(user?.id),
  });

  const summary = useMemo(
    () =>
      data?.summary ?? {
        totalIncome: 0,
        totalExpense: 0,
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans selection:bg-emerald-500 selection:text-white">
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <Header name={user?.first_name || "User"} />
        <MonthSelector
          month={selectedDate.month}
          year={selectedDate.year}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
        />
        <SummaryCards
          balance={summary.balance}
          totalIncome={summary.totalIncome}
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
    </main>
  );
};

export default DashboardPage;
