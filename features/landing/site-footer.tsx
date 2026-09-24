"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BOT_URL } from "./constants";
import { fadeUp } from "./animations";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: BOT_URL, label: "Open Bot", external: true },
] as const;

const SiteFooter = () => {
  return (
    <motion.footer
      className="relative border-t border-white/10 bg-[#070B13]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4 py-10 sm:px-6 lg:px-0 lg:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-sm flex-col gap-3">
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

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            {NAV_LINKS.map((link, index) => (
              <div key={link.href} className="flex items-center gap-3">
                {index > 0 && <span className="text-slate-700" aria-hidden="true">·</span>}
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="font-semibold text-slate-400 transition-colors hover:text-emerald-400"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </nav>
        </div>

        <div className="px-1 text-[11px] text-slate-600">
          <p>© 2026 Where Is My Money. Built for Telegram.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default SiteFooter;
