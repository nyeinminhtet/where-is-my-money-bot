import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExpensesResponse } from "@/types/expense";

type CachedPayload = {
  savedAt: number; // Timestamp
  data: ExpensesResponse;
};

// LocalStorage Helper
const cleanupOldExpensesCache = () => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30; // ရက် ၃၀ (Milliseconds)

  // LocalStorage ထဲက Key အားလုံးကို စစ်မည်
  Object.keys(localStorage).forEach((key) => {
    // ငါတို့ App ရဲ့ expenses cache key ဟုတ်မဟုတ် စစ်မည် (expenses_M_YYYY)
    if (key.startsWith("expenses_")) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item) as CachedPayload;

          // Timestamp သက်တမ်း 1 လကျော်နေရင် ဖျက်ပစ်မည်
          if (parsed.savedAt && now - parsed.savedAt > ONE_MONTH_MS) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Error ပေးနိုင်သော Corrupted data များကိုလည်း ဖျက်ပစ်မည်
        localStorage.removeItem(key);
      }
    }
  });
};

/**
 * Data အသစ်ရတိုင်း Timestamp ပါ တစ်ပါတည်း ထည့်ပြီး LocalStorage ထဲ သိမ်းမည်
 */
const saveCacheWithTimestamp = (
  month: number,
  year: number,
  data: ExpensesResponse,
) => {
  if (typeof window === "undefined") return;

  // Data မသိမ်းမီ အဟောင်းများကို Auto Cleanup အရင်လုပ်မည်
  cleanupOldExpensesCache();

  const payload: CachedPayload = {
    savedAt: Date.now(), // လက်ရှိ အချိန် Timestamp
    data: data,
  };

  localStorage.setItem(`expenses_${month}_${year}`, JSON.stringify(payload));
};

/**
 * LocalStorage ထဲက Cache Data ကို ပြန်ထုတ်ယူမည်
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
    // Timestamp ပါသော Format အသစ်ဟုတ်မဟုတ် စစ်ပြီး Data ပြန်ထုတ်ပေးမည်
    if (parsed && typeof parsed === "object" && "data" in parsed) {
      return (parsed as CachedPayload).data;
    }
    // သို့မဟုတ် Format အဟောင်းဖြစ်နေလျှင် direct Return ပြန်ပေးမည်
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
    queryKey: ["expenses", user?.id, selectedDate.month, selectedDate.year],
    queryFn: async () => {
      const response = await fetch(
        `/api/expenses?telegramId=${user!.id}&month=${selectedDate.month}&year=${selectedDate.year}`,
      );
      if (!response.ok) throw new Error("Failed to load expenses");

      const data = await response.json();

      // save to localStorage with timestamp
      saveCacheWithTimestamp(selectedDate.month, selectedDate.year, data);

      return data;
    },
    enabled: Boolean(user?.id),
    placeholderData: () =>
      getCachedExpenses(selectedDate.month, selectedDate.year),
    staleTime: 1000 * 60 * 5, // 5 မိနစ်အတွင်း re-fetch ထပ်မလုပ်ပါ
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
      const res = await fetch("/api/expenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update transaction");
      return res.json();
    },
    onSuccess: () => {
      // Data ပြင်ပြီးတာနဲ့ Cache ကို Invalid လုပ်ပြီး Dashboard Data အသစ် ပြန်ဆွဲမည်
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

// Transaction ဖျက်ရန် Mutation Hook
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/expenses?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete transaction");
      return res.json();
    },
    onSuccess: () => {
      // Data ဖျက်ပြီးတာနဲ့ Cache ကို Invalid လုပ်ပြီး Dashboard Data အသစ် ပြန်ဆွဲမည်
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
