import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays as CalendarIcon,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { useI18n } from "@/lib/hooks/use-i18n";
import type { TranslationKey } from "@/lib/i18n";

type MonthSelectorProps = {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectDate: (year: number, month: number) => void;
};

const SHORT_MONTH_KEYS: TranslationKey[] = [
  "MONTH_JAN",
  "MONTH_FEB",
  "MONTH_MAR",
  "MONTH_APR",
  "MONTH_MAY",
  "MONTH_JUN",
  "MONTH_JUL",
  "MONTH_AUG",
  "MONTH_SEP",
  "MONTH_OCT",
  "MONTH_NOV",
  "MONTH_DEC",
];

const FULL_MONTH_KEYS: TranslationKey[] = [
  "MONTH_FULL_JAN",
  "MONTH_FULL_FEB",
  "MONTH_FULL_MAR",
  "MONTH_FULL_APR",
  "MONTH_FULL_MAY",
  "MONTH_FULL_JUN",
  "MONTH_FULL_JUL",
  "MONTH_FULL_AUG",
  "MONTH_FULL_SEP",
  "MONTH_FULL_OCT",
  "MONTH_FULL_NOV",
  "MONTH_FULL_DEC",
];

const MonthSelector = ({
  month,
  year,
  onPrev,
  onNext,
  onSelectDate,
}: MonthSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);
  const { t } = useI18n();

  const handleMonthClick = (selectedMonthIndex: number) => {
    onSelectDate(pickerYear, selectedMonthIndex + 1);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/90 px-3 py-3 shadow-lg">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-full border cursor-pointer flex items-center justify-center pr-0.5 size-9 border-slate-700/80 text-slate-300 transition hover:border-emerald-500/50 hover:bg-slate-800/50 hover:text-emerald-400 active:scale-95"
        aria-label="Previous month"
      >
        <ChevronLeft size={25} />
      </button>

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="group cursor-pointer flex gap-3 items-center justify-center rounded-xl px-4 py-1  hover:bg-slate-800/60"
          >
            <CalendarIcon size={18} />
            <p className="text-lg font-semibold text-slate-100 group-hover:text-emerald-300">
              {t(FULL_MONTH_KEYS[month - 1])} {year}
            </p>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="center"
            sideOffset={8}
            className="z-50 w-64 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setPickerYear((y) => y - 1)}
                className="p-1 cursor-pointer text-slate-400 hover:text-slate-100 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-slate-200">
                {pickerYear}
              </span>
              <button
                type="button"
                onClick={() => setPickerYear((y) => y + 1)}
                className="p-1 cursor-pointer text-slate-400 hover:text-slate-100 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SHORT_MONTH_KEYS.map((key, idx) => {
                const isSelected = idx + 1 === month && pickerYear === year;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleMonthClick(idx)}
                    className={`rounded-xl py-2 cursor-pointer text-xs font-medium transition ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                    }`}
                  >
                    {t(key)}
                  </button>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <button
        type="button"
        onClick={onNext}
        className="rounded-full border cursor-pointer flex items-center justify-center border-slate-700/80 size-9 pl-0.5  text-slate-300 transition hover:border-emerald-500/50 hover:bg-slate-800/50 hover:text-emerald-400 active:scale-95"
        aria-label="Next month"
      >
        <ChevronRight size={25} />
      </button>
    </div>
  );
};

export default MonthSelector;
