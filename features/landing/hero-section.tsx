"use client";

import { motion } from "framer-motion";
import { BOT_URL } from "./constants";
import { fadeUp, staggerContainer } from "./animations";
import { CTA_BTN } from "./cta-button";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <header className="relative flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex max-w-xl flex-col items-center gap-7 text-center lg:items-start lg:text-left"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.span
          variants={fadeUp}
          className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-400"
        >
          AI Voice & Vision Expense Tracking
        </motion.span>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Know where your{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200 bg-clip-text text-transparent">
            money goes
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="max-w-md text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Voice note, receipt photo, or Myanmar text—AI parses & tracks
          automatically. Keep the context of every kyat without slowing down
          your day.
        </motion.p>

        <motion.div variants={fadeUp} custom={3}>
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(CTA_BTN, "group")}
          >
            Open in Telegram
            <span className="ml-2" aria-hidden="true">
              <MoveRight className="size-4 ease-in-out duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default HeroSection;
