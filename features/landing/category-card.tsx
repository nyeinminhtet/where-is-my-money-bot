"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const CategoryCard = () => {
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
          🗂️
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">
            AI Auto-Categorization
          </span>
          <span className="text-[11px] text-slate-500">
            Every entry, sorted instantly
          </span>
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center">
        <div className="relative h-full max-h-[220px] w-full overflow-hidden rounded-xl border border-slate-700/60 bg-[#0B1220] shadow-[0_0_30px_rgba(16,185,129,0.15)] sm:max-h-[260px]">
          <Image
            src="/assets/mini-app/analytics.png"
            alt="Analytics screen with donut chart and expense category list"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain object-top"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {["Auto-sorted", "Donut chart"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-700/50 bg-[#131C31]/70 px-3 py-1 text-[10px] text-slate-500 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryCard;
