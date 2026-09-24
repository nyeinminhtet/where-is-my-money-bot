"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BOT_URL } from "@/features/landing/constants";
import { fadeUp, staggerContainer } from "@/features/landing/animations";
import { MoveUpRight } from "lucide-react";

const NotFoundPage = () => {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#090D16] px-6 py-12 text-center text-slate-100 selection:bg-emerald-500 selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <motion.span
        className="relative z-10 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs tracking-widest text-emerald-400"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        [ 404 • PAGE NOT FOUND ]
      </motion.span>

      <motion.div
        className="relative z-10 flex max-w-xl flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeUp}
          custom={1}
          className="bg-linear-to-b from-slate-100 via-slate-400 to-slate-700 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent drop-shadow-[0_0_40px_rgba(16,185,129,0.15)] sm:text-9xl"
        >
          404
        </motion.p>

        <motion.h1
          variants={fadeUp}
          custom={2}
          className="mt-4 text-2xl font-bold tracking-tight text-slate-100 sm:text-4xl"
        >
          Lost in the ledger?
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={3}
          className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base"
        >
          The page you are looking for was moved, deleted, or never recorded.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={4}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-slate-950 transition-all hover:bg-emerald-400"
          >
            Return Home
          </Link>
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-sm group flex items-center gap-1 text-slate-400 transition-all hover:text-slate-200"
          >
            Open Telegram Bot
            <span aria-hidden="true">
              <MoveUpRight className="size-3.5 group-hover:-translate-y-0.5 ease-in-out duration-300 group-hover:translate-x-0.5" />
            </span>
          </a>
        </motion.div>
      </motion.div>

      <motion.p
        className="relative z-10 rounded-full border border-slate-800/80 bg-slate-900/50 px-4 py-2 font-mono text-xs text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {'> bot.parse("where is my page?") → 404_NOT_FOUND'}
      </motion.p>
    </main>
  );
};

export default NotFoundPage;
