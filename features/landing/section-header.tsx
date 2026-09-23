"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./animations";

type SectionHeaderProps = {
  label: string;
  title: string;
  highlight: string;
};

const SectionHeader = ({ label, title, highlight }: SectionHeaderProps) => {
  return (
    <motion.div
      className="flex flex-col gap-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
        {label}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
        {title}{" "}
        <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
    </motion.div>
  );
};

export default SectionHeader;
