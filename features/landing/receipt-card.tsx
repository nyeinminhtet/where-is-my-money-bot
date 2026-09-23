"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const ReceiptCard = () => {
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
          📷
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Receipt OCR</span>
          <span className="text-[11px] text-slate-500">
            Snap it — AI reads the amount
          </span>
        </div>
      </div>

      <div className="group/receipt relative flex min-h-[220px] flex-1 flex-col justify-center overflow-hidden rounded-xl border border-slate-700/60 bg-[#0B1220] p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)] sm:min-h-[260px]">
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover/receipt:bg-emerald-500/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />

        <div className="relative flex items-center gap-3.5">
          <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-700/50 bg-gradient-to-b from-slate-800 to-slate-900 text-xl shadow-inner transition-transform group-hover/receipt:scale-105">
            🧾
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-300">
                receipt_0923.jpg
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-500">
                JPEG
              </span>
            </div>
            <div className="h-1.5 w-32 rounded-full bg-slate-800" />
            <div className="h-1.5 w-20 rounded-full bg-slate-800" />
            <div className="mt-1.5 flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-400">
                12,500 MMK extracted
              </span>
            </div>
          </div>
        </div>

        {/* Hover preview of real transaction log */}
        <div className="absolute inset-0 flex items-end justify-center bg-[#0F172A]/95 p-3 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/receipt:opacity-100">
          <div className="w-full overflow-hidden rounded-lg border border-slate-700/60 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Image
              src="/assets/mini-app/transactions.png"
              alt="Mini App transaction log preview with Myanmar language entries"
              width={922}
              height={1692}
              className="h-36 w-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {["Auto-categorized", "Zero typing"].map((tag) => (
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

export default ReceiptCard;
