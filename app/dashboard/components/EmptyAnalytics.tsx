import { BarChart3 } from "lucide-react";

const EmptyAnalytics = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-3 text-slate-400">
      <BarChart3 className="w-8 h-8 opacity-60" />
    </div>
    <p className="text-slate-300 font-medium mb-1">
      ဒီလအတွက် စာရင်းအချက်အလက် မရှိသေးပါ
    </p>
    <p className="text-xs text-slate-500 max-w-55">
      Bot ထဲမှာ ဝင်ငွေ/ထွက်ငွေ စာရင်းစရိုက်ရင် ဒီနေရာမှာ Chart နဲ့ Category
      အလိုက် မြင်ရပါမယ်။
    </p>
  </div>
);

export default EmptyAnalytics;
