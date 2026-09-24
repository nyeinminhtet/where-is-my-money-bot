"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Mic2,
  MoveRight,
  Send,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { BOT_URL } from "./constants";

type DemoMode = "voice" | "receipt" | "text";

const DEMOS: Record<
  DemoMode,
  {
    label: string;
    prompt: string;
    result: string;
    amount: string;
    category: string;
  }
> = {
  voice: {
    label: "Voice note",
    prompt: "Voice note · 0:04",
    result: "Taxi fare",
    amount: "3,500 MMK",
    category: "Transport",
  },
  receipt: {
    label: "Receipt snap",
    prompt: "Receipt photo · OCR ready",
    result: "City Mart groceries",
    amount: "18,400 MMK",
    category: "Food",
  },
  text: {
    label: "Text input",
    prompt: "မုန့်ဖိုး ၂၀၀၀",
    result: "မုန့်ဖိုး",
    amount: "2,000 MMK",
    category: "Food",
  },
};

const LiveDemo = () => {
  const [mode, setMode] = useState<DemoMode>("voice");
  const demo = DEMOS[mode];

  return (
    <section id="demo" className="relative flex scroll-mt-24 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Try the workflow
        </span>
        <h2 className="max-w-2xl text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
          From messy input to a clean money trail.
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-slate-400">
          Send the bot whatever is easiest. See how it turns everyday moments
          into useful records.
        </p>
      </div>
      <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#101827]/80 shadow-2xl shadow-black/30 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-between border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="size-4 text-emerald-400" /> Live parser
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Choose an input and watch the result update instantly.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {(Object.keys(DEMOS) as DemoMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${mode === item ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
              >
                <span>{DEMOS[item].label}</span>
                <span className="text-xs opacity-50">
                  0{Object.keys(DEMOS).indexOf(item) + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative flex min-h-96 flex-col justify-end bg-[#0b111d] p-5 sm:p-8">
          <div className="absolute right-8 top-8 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />{" "}
            Telegram bot online
          </div>
          <div className="flex flex-col gap-4">
            <motion.div
              key={`${mode}-input`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xs self-end rounded-2xl rounded-br-md bg-[#15725d] px-4 py-3 text-sm text-white shadow-lg shadow-emerald-950/20"
            >
              <div className="mb-2 flex items-center gap-2 text-emerald-100/70">
                {mode === "voice" ? (
                  <Mic2 className="size-4" />
                ) : mode === "receipt" ? (
                  <ImageIcon className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
                <span className="text-xs">You sent</span>
              </div>
              {demo.prompt}
            </motion.div>
            <motion.div
              key={`${mode}-result`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-sm rounded-2xl rounded-bl-md border border-white/10 bg-[#172333] p-4 text-sm text-slate-300"
            >
              <div className="mb-3 flex items-center gap-2 text-emerald-300">
                <Sparkles className="size-4" /> Recorded automatically
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="font-medium text-white">{demo.result}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {demo.category} · just now
                  </div>
                </div>
                <div className="font-mono text-base text-emerald-300">
                  {demo.amount}
                </div>
              </div>
            </motion.div>
          </div>
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex group items-center justify-center self-end rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#06130f] transition hover:bg-emerald-300"
          >
            Try it in Telegram{" "}
            <span className="ml-2" aria-hidden="true">
              <MoveRight className="size-4 ease-in-out duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
