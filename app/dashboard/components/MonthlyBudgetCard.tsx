import { formatCurrency } from "@/utils/formatCurrency";

interface BudgetCardProps {
  monthlyBudget: number | null;
  totalExpense: number;
  isLoading: boolean;
}

const MonthlyBudgetCard = ({
  monthlyBudget,
  totalExpense,
  isLoading,
}: BudgetCardProps) => {
  // 1. Loading State (Skeleton UI)
  if (isLoading) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm space-y-3 animate-pulse">
        <div className="flex justify-between items-center text-sm">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-4 w-8 bg-slate-800 rounded" />
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full" />
        <div className="flex justify-between items-center text-xs">
          <div className="h-3 w-20 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  // 2. Empty State (No Budget Set)
  if (!monthlyBudget) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm flex items-center justify-between text-sm">
        <span className="font-medium text-slate-400">
          📊 လစဉ် Budget သုံးစွဲမှု
        </span>
        <span className="text-xs text-slate-500 italic">
          သတ်မှတ်ထားခြင်း မရှိပါ
        </span>
      </div>
    );
  }

  // 3. Calculation
  const actualPercentage = Math.round((totalExpense / monthlyBudget) * 100);
  const progressPercentage = Math.min(actualPercentage, 100);

  const isOverBudget = totalExpense >= monthlyBudget;
  const isWarning = totalExpense >= monthlyBudget * 0.8 && !isOverBudget;

  // Dynamic Color
  const getProgressColor = () => {
    if (isOverBudget) return "bg-rose-500";
    if (isWarning) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getTextColor = () => {
    if (isOverBudget) return "text-rose-400";
    if (isWarning) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm space-y-3">
      {/* Header Info */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-slate-300">
          📊 လစဉ် Budget သုံးစွဲမှု
        </span>
        <span className={`font-semibold ${getTextColor()}`}>
          {actualPercentage}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Footer Details */}
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>သုံးပြီး: {formatCurrency(totalExpense)}</span>
        <span>Budget: {formatCurrency(monthlyBudget)}</span>
      </div>

      {/* Warning Badges */}
      {isOverBudget && (
        <p className="text-xs text-rose-400 font-medium pt-1 flex items-center gap-1">
          🚨 Budget ကျော်လွန်သွားပါပြီ!
        </p>
      )}
      {isWarning && (
        <p className="text-xs text-amber-400 font-medium pt-1 flex items-center gap-1">
          ⚠️ Budget ရဲ့ 80% ရောက်နေပါပြီ!
        </p>
      )}
    </div>
  );
};

export default MonthlyBudgetCard;
