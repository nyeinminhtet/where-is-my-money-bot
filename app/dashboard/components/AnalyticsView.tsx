import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import EmptyAnalytics from "./EmptyAnalytics";

type CategoryBreakdown = {
  category: string;
  amount: number;
};

type AnalyticsViewProps = {
  breakdown: CategoryBreakdown[];
  isLoading: boolean;
};

// 🎨 High-Contrast & Modern Palette for Categories
const PALETTE = [
  "#10b981", // Emerald Green
  "#f97316", // Orange
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#eab308", // Yellow
  "#a855f7", // Purple
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
  "#84cc16", // Lime
  "#6366f1", // Indigo
];

// Helper: Consistent Color Generator based on Category Name
const getCategoryColor = (categoryName: string, index: number): string => {
  return PALETTE[index % PALETTE.length];
};

const AnalyticsView = ({ breakdown, isLoading }: AnalyticsViewProps) => {
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
              formatter={(value) => [
                `${Number(value ?? 0).toLocaleString()} Ks`,
                "ပမာဏ",
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
                  {/* Category Color Dot for clear identification */}
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-300 font-medium">
                    {item.category}
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
              <p className="text-[11px] text-slate-500 pl-4">
                {percentage}% of spending
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsView;
