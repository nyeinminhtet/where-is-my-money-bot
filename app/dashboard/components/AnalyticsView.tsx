import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import EmptyAnalytics from "./EmptyAnalytics";
import { useI18n } from "@/lib/hooks/useI18n";
import { getCategoryName } from "@/lib/helpers/category-translations";

type CategoryBreakdown = {
  category: string;
  amount: number;
};

type AnalyticsViewProps = {
  breakdown: CategoryBreakdown[];
  isLoading: boolean;
};

const PALETTE = [
  "#10b981",
  "#f97316",
  "#ec4899",
  "#3b82f6",
  "#eab308",
  "#a855f7",
  "#06b6d4",
  "#f43f5e",
  "#84cc16",
  "#6366f1",
];

const getCategoryColor = (categoryName: string, index: number): string => {
  return PALETTE[index % PALETTE.length];
};

const AnalyticsView = ({ breakdown, isLoading }: AnalyticsViewProps) => {
  const { lang, t } = useI18n();
  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4">
        <div className="h-40 animate-pulse rounded-xl bg-slate-800/70" />
      </div>
    );
  }

  if (breakdown.length === 0) {
    return <EmptyAnalytics />;
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4 space-y-4">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              formatter={(value, name) => [
                `${Number(value ?? 0).toLocaleString()} Ks`,
                getCategoryName(String(name), lang, t),
              ]}
            />
            <Pie
              data={breakdown}
              dataKey="amount"
              nameKey="category"
              innerRadius={50}
              outerRadius={78}
              paddingAngle={2}
            >
              {breakdown.map((entry, index) => (
                <Cell
                  key={`${entry.category}-${index}`}
                  fill={getCategoryColor(entry.category, index)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, index) => {
          const percentage =
            total > 0 ? Math.round((item.amount / total) * 100) : 0;
          const color = getCategoryColor(item.category, index);

          return (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-300 font-medium">
                    {/* 💡 ဒီနေရာမှာ getCategoryName သုံးပေးရပါမယ် */}
                    {getCategoryName(item.category, lang, t)}
                  </span>
                </div>
                <span className="text-slate-400 font-mono">
                  {item.amount.toLocaleString()} Ks
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500 pl-4">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsView;
