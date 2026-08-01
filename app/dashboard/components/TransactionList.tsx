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

const TransactionList = ({
  transactions,
  isLoading,
  isError,
  errorMessage,
}: TransactionListProps) => {
  const groupedTransactions = transactions.reduce<
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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 text-xs">
        စာရင်း မရှိသေးပါ။ Bot ထဲမှာ စာရင်းစရိုက်ကြည့်ပါ!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedTransactions).map(([dateGroup, items]) => (
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
              const txTime = new Date(tx.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

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
                    className={`text-sm font-bold font-mono ${isIncome ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {isIncome ? "+" : "-"}
                    {tx.amount.toLocaleString()} Ks
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
