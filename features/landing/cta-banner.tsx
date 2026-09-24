"use client";

import { motion } from "framer-motion";
import { BOT_URL } from "./constants";
import { fadeUp } from "./animations";
import { CTA_BTN } from "./cta-button";

const CtaBanner = () => {
  return (
    <motion.section
      className="relative -mx-4 overflow-hidden border-y border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/80 to-emerald-950/30 px-6 py-10 text-center sm:mx-0 sm:rounded-3xl sm:border sm:px-16 sm:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-96 -translate-x-1/2 animate-pulse rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-32 w-48 rounded-full bg-teal-500/5 blur-[80px]" />

      <div className="relative flex flex-col items-center gap-5">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          Ready to Track
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Your Money?
          </span>
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-slate-400">
          Join thousands managing their finances the smart way. No sign-up, no
          forms — just open and go.
        </p>
        <a
          href={BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CTA_BTN} mt-2 px-10 py-4`}
        >
          Open in Telegram →
        </a>
        <p className="text-xs text-slate-500">
          🌐 Available in မြန်မာ and English
        </p>
      </div>
    </motion.section>
  );
};

export default CtaBanner;
