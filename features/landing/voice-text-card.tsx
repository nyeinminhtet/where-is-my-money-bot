"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

const VoiceTextCard = () => {
  return (
    <motion.div
      className="grid grid-cols-1 items-center gap-4 md:grid-cols-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
    >
      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-base shadow-[0_0_16px_rgba(16,185,129,0.15)]">
            🎤
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              Voice & Smart Text
            </span>
            <span className="text-[11px] text-slate-500">
              Speak or type — AI understands
            </span>
          </div>
        </div>

        {/* Animated waveform */}
        <div className="group flex items-center gap-3 rounded-xl border border-slate-700/50 bg-[#131C31]/70 px-4 py-3.5 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]">
          <div className="flex items-center gap-[3px] h-7">
            {[6, 12, 20, 14, 22, 10, 17, 7, 15, 18, 8, 16, 11, 21, 6, 13, 9, 19].map(
              (h, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-gradient-to-t from-emerald-600 to-emerald-400"
                  initial={{ height: 4 }}
                  animate={{ height: [4, h, 4] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.07,
                    ease: "easeInOut",
                  }}
                />
              ),
            )}
          </div>
          <span className="ml-auto text-[10px] text-slate-500">0:04</span>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Works with Myanmar digits (၂၀၀၀), English, or mixed — no commands
          needed.
        </p>
      </motion.div>

      {/* Real Mini App transaction log preview */}
      <motion.div
        variants={fadeUp}
        className="group/tx relative overflow-hidden rounded-xl border border-slate-700/60 bg-[#0B1220] shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all hover:border-emerald-500/50"
      >
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover/tx:bg-emerald-500/20" />
        <Image
          src="/assets/mini-app/transactions.png"
          alt="Mini App transaction log with Myanmar language expense entries"
          width={922}
          height={1692}
          className="h-auto max-h-[220px] w-full object-contain object-top"
        />
        <span className="absolute right-4 bottom-4 rounded-full border border-emerald-500/30 bg-[#0F172A]/90 px-2.5 py-1 text-[10px] font-medium text-emerald-400 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/tx:opacity-100">
          Real transaction log
        </span>
      </motion.div>
    </motion.div>
  );
};

export default VoiceTextCard;
