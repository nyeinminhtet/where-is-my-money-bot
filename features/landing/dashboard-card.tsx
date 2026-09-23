"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const DashboardCard = () => {
  return (
    <motion.div
      className="flex h-full flex-col gap-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-base shadow-[0_0_16px_rgba(16,185,129,0.15)]">
          📱
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            Mini App Dashboard
          </span>
          <span className="text-[11px] text-slate-500">
            Balances, budgets & charts
          </span>
        </div>
      </div>

      <div className="relative h-full min-h-55 w-full flex-1 overflow-hidden rounded-xl border border-slate-700/60 shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-[1.02] sm:min-h-95">
        <Image
          src="/assets/mini-app/hero.png"
          alt="Where Is My Money Mini App dashboard showing total balance, income and expense summary"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          // className="object-cover  object-top"
        />
      </div>

      <div className="flex gap-2">
        {["Food", "Transport", "Shopping"].map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-slate-700/50 bg-[#131C31]/70 px-3 py-1 text-[10px] text-slate-500 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
          >
            {cat}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
