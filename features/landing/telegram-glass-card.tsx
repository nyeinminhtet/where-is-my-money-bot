"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, staggerContainer } from "./animations";

const BUBBLES = [
  { side: "user", content: "မုန့်ဖိုး ၂၀၀၀", time: "10:24", type: "text" },
  {
    side: "bot",
    content: "✅ Recorded — ",
    detail: "မုန့်ဖိုး · 2,000 MMK",
    time: "10:24",
    type: "text",
  },
  { side: "user", content: "", time: "10:25", type: "voice" },
  {
    side: "bot",
    content: "✅ Recorded — ",
    detail: "Taxi fare · 3,500 MMK",
    time: "10:25",
    type: "text",
  },
] as const;

const TelegramGlassCard = () => {
  return (
    <motion.div
      className="relative w-full max-w-md"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-[60px] pointer-events-none" />
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-[#17212B] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none"
        // animate={floatAnimation}
      >
        {/* Telegram Header */}
        <div className="relative mb-4 flex items-center gap-3 border-b border-slate-700/40 pb-4">
          <div className="relative">
            <Image
              src="/assets/logos/logo.jpeg"
              alt="Where Is My Money"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#17212B] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              Where Is My Money
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400/80">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              bot
            </span>
          </div>
        </div>

        {/* Chat Bubbles — staggered entrance */}
        <div
          className="relative flex flex-col gap-3 font-sans leading-relaxed"
          style={{
            fontFamily:
              "'Nunito Sans', 'Padauk', 'Noto Sans Myanmar', sans-serif",
          }}
        >
          {BUBBLES.map((b, i) => (
            <motion.div
              key={i}
              custom={i * 0.4 + 0.5}
              variants={fadeUp}
              className={
                b.side === "user"
                  ? "max-w-[85%] self-end rounded-2xl rounded-tr-md bg-[#0E6754] px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_12px_rgba(14,103,84,0.3)]"
                  : "max-w-[90%] self-start rounded-2xl rounded-tl-md border border-slate-700/40 bg-[#1E2C3A] px-4 py-2.5 text-xs leading-relaxed text-slate-300"
              }
            >
              {b.type === "voice" ? (
                <div className="flex items-center gap-2.5">
                  <span>🎤</span>
                  <div className="flex items-end gap-[3px] h-5">
                    {[5, 10, 16, 11, 18, 8, 14, 6, 12, 15, 7, 13].map(
                      (h, j) => (
                        <motion.div
                          key={j}
                          className="w-[3px] rounded-full bg-white/70"
                          initial={{ height: 2 }}
                          animate={{ height: [2, h, 2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: j * 0.06,
                            ease: "easeInOut",
                          }}
                        />
                      ),
                    )}
                  </div>
                  <span className="text-[10px] text-white/60">0:04</span>
                </div>
              ) : (
                <>
                  {b.content}
                  {"detail" in b && (
                    <span className="text-slate-400">{b.detail}</span>
                  )}
                </>
              )}
              <span
                className={`ml-2 text-[10px] ${
                  b.side === "user" ? "text-white/50" : "text-slate-500"
                }`}
              >
                {b.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TelegramGlassCard;
