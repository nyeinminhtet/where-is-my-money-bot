type SummaryCardsProps = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  isLoading: boolean;
};

const SummaryCards = ({
  balance,
  totalIncome,
  totalExpense,
  isLoading,
}: SummaryCardsProps) => {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4 space-y-4 shadow-xl">
      <div>
        <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">
          Net Balance (လက်ကျန်ငွေ)
        </p>
        <p
          className={`text-3xl font-black tracking-tight mt-1 ${balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
        >
          {isLoading ? "..." : `${balance.toLocaleString()} Ks`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
        <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
          <p className="text-[10px] text-emerald-400 font-mono uppercase">
            Total Income
          </p>
          <p className="text-base font-bold text-emerald-300 mt-0.5">
            +{isLoading ? "..." : totalIncome.toLocaleString()} Ks
          </p>
        </div>

        <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          <p className="text-[10px] text-rose-400 font-mono uppercase">
            Total Expense
          </p>
          <p className="text-base font-bold text-rose-300 mt-0.5">
            -{isLoading ? "..." : totalExpense.toLocaleString()} Ks
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
