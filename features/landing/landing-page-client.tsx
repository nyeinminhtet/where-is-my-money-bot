"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TelegramGlassCard from "@/features/landing/telegram-glass-card";
import VoiceTextCard from "@/features/landing/voice-text-card";
import ReceiptCard from "@/features/landing/receipt-card";
import DashboardCard from "@/features/landing/dashboard-card";
import CategoryCard from "@/features/landing/category-card";
import SectionHeader from "@/features/landing/section-header";
import HeroSection from "@/features/landing/hero-section";
import CtaBanner from "@/features/landing/cta-banner";
import SiteFooter from "@/features/landing/site-footer";
import { BOT_URL, STEPS } from "@/features/landing/constants";
import { fadeUp, staggerContainer } from "@/features/landing/animations";

const GLASS =
  "group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-[#131C31]/70 backdrop-blur-xl shadow-xl shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none";

const LandingPageClient = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#0F172A] text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Dot grid texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #10B981 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 font-sans sm:gap-16 sm:px-6 lg:gap-24 lg:px-0 lg:py-12"
        style={{
          fontFamily:
            "'Nunito Sans', 'Padauk', 'Noto Sans Myanmar', sans-serif",
        }}
      >
        {/* Ambient animated glow orbs */}
        <div className="pointer-events-none absolute -top-20 left-1/4 h-96 w-96 animate-pulse rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-64 w-64 rounded-full bg-teal-500/5 blur-[120px]" />
        <div
          className="pointer-events-none absolute top-1/2 left-0 h-72 w-72 animate-pulse rounded-full bg-emerald-500/5 blur-[140px]"
          style={{ animationDelay: "2s" }}
        />

        {/* NAVBAR */}
        <motion.nav
          className="relative flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logos/logo.jpeg"
              alt="Where Is My Money"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-emerald-950/40"
            />
            <span className="text-sm font-bold tracking-tight text-white">
              Where Is My Money
            </span>
          </div>
          <a
            href={BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95"
          >
            Open Bot
          </a>
        </motion.nav>

        {/* HERO */}
        <div className="relative flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
          <HeroSection />
          <TelegramGlassCard />
        </div>

        {/* BENTO FEATURES */}
        <section
          id="features"
          className="relative flex scroll-mt-20 flex-col gap-8 sm:scroll-mt-24"
        >
          <SectionHeader
            label="Features"
            title="Control Your"
            highlight="Budget"
          />
          <motion.div
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              className={`${GLASS} md:col-span-2 p-4 sm:p-6 lg:p-7`}
            >
              <VoiceTextCard />
            </motion.div>
            <motion.div
              variants={fadeUp}
              className={`${GLASS} md:col-span-1 md:row-span-2 p-4 sm:p-6 lg:p-7`}
            >
              <DashboardCard />
            </motion.div>
            <motion.div
              variants={fadeUp}
              className={`${GLASS} p-4 sm:p-6 lg:p-7`}
            >
              <ReceiptCard />
            </motion.div>
            <motion.div
              variants={fadeUp}
              className={`${GLASS} p-4 sm:p-6 lg:p-7`}
            >
              <CategoryCard />
            </motion.div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="relative flex scroll-mt-20 flex-col gap-10 sm:scroll-mt-24"
        >
          <SectionHeader
            label="How It Works"
            title="Three Steps."
            highlight="Done."
          />
          <motion.div
            className="relative grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {/* Connecting line — desktop only */}
            <div className="pointer-events-none absolute top-7 left-[16%] right-[16%] hidden h-[2px] bg-gradient-to-r from-emerald-500/50 via-emerald-500/30 to-slate-800 sm:block" />
            {STEPS.map((s) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                className="relative flex flex-col items-center gap-3 text-center sm:gap-4"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-[#131C31] shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                  <span className="text-lg font-black text-emerald-400">
                    {s.num}
                  </span>
                  <span className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-xl" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="max-w-[240px] text-sm leading-relaxed text-slate-400">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <CtaBanner />
      </div>

      {/* Full-width footer outside the content container */}
      <SiteFooter />
    </main>
  );
};

export default LandingPageClient;
