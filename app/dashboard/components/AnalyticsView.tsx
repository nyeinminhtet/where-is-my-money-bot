import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type CategoryBreakdown = {
  category: string;
  amount: number;
};

type AnalyticsViewProps = {
  breakdown: CategoryBreakdown[];
  isLoading: boolean;
};

const COLORS = [
  "#34d399",
  "#fb923c",
  "#f472b6",
  "#60a5fa",
  "#facc15",
  "#a78bfa",
];

export default function AnalyticsView({
  breakdown,
  isLoading,
}: AnalyticsViewProps) {
  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4">
        <div className="h-40 animate-pulse rounded-xl bg-slate-800/70" />
      </div>
    );
  }

  if (breakdown.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-6 text-center text-sm text-slate-500">
        No expense breakdown for this month yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/90 p-4 space-y-4">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
                  fill={COLORS[index % COLORS.length]}
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
          return (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{item.category}</span>
                <span className="text-slate-400">
                  {item.amount.toLocaleString()} Ks
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {percentage}% of spending
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
