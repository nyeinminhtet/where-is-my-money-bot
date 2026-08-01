import { ChevronLeft, ChevronRight } from "lucide-react";

type MonthSelectorProps = {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthSelector = ({ month, year, onPrev, onNext }: MonthSelectorProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/90 px-3 py-3 shadow-lg">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
        aria-label="Previous month"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
          Selected month
        </p>
        <p className="text-sm font-semibold text-slate-100">
          {monthNames[month - 1]} {year}
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default MonthSelector;
