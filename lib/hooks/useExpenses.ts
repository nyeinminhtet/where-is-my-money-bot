import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExpensesResponse } from "@/types/expense";
import { getTelegramInitData } from "@/lib/telegram-webapp";

type CachedPayload = {
  savedAt: number; // Timestamp
  data: ExpensesResponse;
};

// LocalStorage Helper
const cleanupOldExpensesCache = () => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30; // 30 days (milliseconds)

  // Scan all keys in localStorage.
  Object.keys(localStorage).forEach((key) => {
    // Only target this app's expense cache keys (expenses_M_YYYY).
    if (key.startsWith("expenses_")) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item) as CachedPayload;

          // Remove entries older than one month based on their savedAt timestamp.
          if (parsed.savedAt && now - parsed.savedAt > ONE_MONTH_MS) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Remove any corrupted/unparseable cache entries.
        localStorage.removeItem(key);
      }
    }
  });
};

/**
 * Save data to localStorage with a savedAt timestamp for expiry tracking.
 */
const saveCacheWithTimestamp = (
  month: number,
  year: number,
  data: ExpensesResponse,
) => {
  if (typeof window === "undefined") return;

  // Auto-clean expired entries before writing new data.
  cleanupOldExpensesCache();

  const payload: CachedPayload = {
    savedAt: Date.now(), // Current timestamp
    data: data,
  };

  localStorage.setItem(`expenses_${month}_${year}`, JSON.stringify(payload));
};

/**
 * Retrieve cached data from localStorage.
 */
const getCachedExpenses = (
  month: number,
  year: number,
): ExpensesResponse | undefined => {
  if (typeof window === "undefined") return undefined;

  const cached = localStorage.getItem(`expenses_${month}_${year}`);
  if (!cached) return undefined;

  try {
    const parsed = JSON.parse(cached);
    // Return the data for the newer timestamped format, if present.
    if (parsed && typeof parsed === "object" && "data" in parsed) {
      return (parsed as CachedPayload).data;
    }
    // Otherwise fall back to the legacy direct format.
    return parsed as ExpensesResponse;
  } catch {
    return undefined;
  }
};

export const useExpenses = (
  user: { id: number | string } | null,
  selectedDate: { month: number; year: number },
) => {
  return useQuery<ExpensesResponse>({
    queryKey: ["transactions", user?.id, selectedDate.month, selectedDate.year],
    queryFn: async () => {
      const initData = getTelegramInitData();
      const response = await fetch(
        `/api/transactions?telegramId=${user!.id}&month=${selectedDate.month}&year=${selectedDate.year}`,
        {
          headers: initData ? { "x-telegram-init-data": initData } : {},
        },
      );
      if (!response.ok) throw new Error("Failed to load transacitons");

      const data = await response.json();

      // save to localStorage with timestamp
      saveCacheWithTimestamp(selectedDate.month, selectedDate.year, data);

      return data;
    },
    enabled: Boolean(user?.id),
    placeholderData: () =>
      getCachedExpenses(selectedDate.month, selectedDate.year),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      title: string;
      amount: number;
      category: string;
      type: "INCOME" | "EXPENSE";
    }) => {
      const initData = getTelegramInitData();
      const res = await fetch("/api/transactions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(initData ? { "x-telegram-init-data": initData } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update transaction");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate the cache so the dashboard refetches fresh data.
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

// Mutation hook for deleting a transaction.
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const initData = getTelegramInitData();
      const res = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
        headers: initData ? { "x-telegram-init-data": initData } : {},
      });
      if (!res.ok) throw new Error("Failed to delete transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
