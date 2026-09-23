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
      className="relative border-t border-slate-800/80 bg-[#0B1220]/80"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-0 lg:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex max-w-xs flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logos/logo.jpeg"
                alt="Where Is My Money"
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-emerald-950/40"
              />
              <span className="text-sm font-bold tracking-tight text-white">
                Where Is My Money
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              AI-powered personal finance for Telegram. Log expenses with voice,
              photos, or text — in မြန်မာ and English.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4 sm:items-end">
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs text-slate-400 transition-colors hover:text-emerald-400"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 transition-colors hover:text-emerald-400"
              >
                Open Bot →
              </a>
            </nav>
            <p className="text-[11px] text-slate-600">
              🌐 Available in မြန်မာ and English
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 border-t border-slate-800/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} Where Is My Money. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-600">
            Built for Telegram Mini Apps
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default SiteFooter;
