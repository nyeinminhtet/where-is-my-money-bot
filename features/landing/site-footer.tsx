"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BOT_URL } from "./constants";
import { fadeUp } from "./animations";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
] as const;

const SiteFooter = () => {
  return (
    <motion.footer
      className="relative mt-4 border-t border-white/10 bg-[#070B13]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-0 lg:py-12">
        <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-[#101827]/70 p-5 shadow-2xl shadow-black/20 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logos/logo.jpeg"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-cover shadow-lg shadow-emerald-950/40"
              />
              <div>
                <p className="text-sm font-black tracking-tight text-white">Where Is My Money</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">Telegram finance companion</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Track spending naturally with voice, photos, or text — in မြန်မာ and English.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-8">
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-xs font-semibold text-slate-400 transition-colors hover:text-emerald-400">
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href={BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center rounded-full border border-emerald-400/40 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400 hover:text-[#06130f]"
            >
              Open Telegram ↗
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-1 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Where Is My Money</p>
          <p>မြန်မာ · English · Built for Telegram</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default SiteFooter;
