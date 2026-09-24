"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BOT_URL } from "@/features/landing/constants";
import { MoveUpRight } from "lucide-react";

const LandingNavbar = () => {
  return (
    <motion.nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 -mx-4 flex w-[calc(100%+2rem)] items-center justify-between border-0 bg-[#090D16]/30 px-4 py-4 backdrop-blur-md sm:top-3 sm:mx-0 sm:w-auto sm:rounded-full sm:border sm:border-white/10 sm:bg-[#101827]/90 sm:px-3 sm:py-2 sm:shadow-2xl sm:shadow-black/30 sm:backdrop-blur-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <a
        href="#top"
        className="flex min-w-0 items-center gap-2.5 rounded-full px-1.5 py-1"
        aria-label="Where Is My Money home"
      >
        <Image
          src="/assets/logos/logo.jpeg"
          alt=""
          width={36}
          height={36}
          className="size-9 rounded-full object-cover shadow-lg shadow-emerald-950/40"
        />
        <span className="truncate text-xs font-bold tracking-tight text-white sm:text-sm">
          Where Is My Money
        </span>
      </a>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href="#features"
          className="hidden rounded-full px-2 py-2 text-xs font-semibold text-slate-400 transition hover:text-white sm:inline-flex"
        >
          Explore
        </a>
        <a
          href={BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center group justify-center rounded-full bg-emerald-400 px-3.5 py-2.5 text-[11px] font-black text-[#06130f] shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:bg-emerald-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 sm:px-4 sm:text-xs"
        >
          Try Telegram
          <span className="ml-1" aria-hidden="true">
            <MoveUpRight className="size-3 group-hover:-translate-y-0.5 ease-in-out duration-300 group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;
