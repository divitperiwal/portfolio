"use client";

import * as motion from "motion/react-client";
import Image from "next/image";

interface HeroSectionProps {
  contributionGrid: number[][];
  totalContributions: string;
  totalCommits: string;
  lastContribution: string;
}

const COLORS = ["#ebedf0", "#c6c6c6", "#8c8c8c", "#505050", "#1a1a1a"];

const CAPABILITIES = [
  "Translating product ideas into system design",
  "Anticipating failure modes and edge cases",
  "Refactoring without breaking behavior",
  "Tracing bugs across multiple layers",
  "Making small systems scale predictably",
  "Keeping code understandable over time",
];

const CURRENTLY_LEARNING = ["GO LANG", "SYSTEM DESIGN", "K8S", "WEBSOCKETS"];

const STATIC_STATS = [
  { value: "10+", label: "Projects" },
  { value: "3+", label: "Years" },
  { value: null, label: "Commits" },
  { value: "8+", label: "Tech Used" },
];

const TECH_ITEMS = [
  "TypeScript",
  "Node.js",
  "Next.js",
  "PostgreSQL",
  "Redis",
  "Drizzle",
  "Docker",
  "Linux",
  "Nginx",
  "Git",
  "Scheduled Jobs",
];

/* ── Shared animation presets ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

const lineExpand = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

export default function HeroSection({
  contributionGrid,
  totalContributions,
  totalCommits,
  lastContribution,
}: HeroSectionProps) {
  const grid = contributionGrid;

  return (
    <section className="relative z-0 bg-linear-to-br from-[#fafafa] via-[#f5f5f5] to-[#fafafa] text-[#1a1a1a]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        {/* ── Document Reference Bar ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]"
        >
          <span>01 — ABOUT</span>
          <span className="hidden sm:inline group/loc relative cursor-default">
            CHENNAI, INDIA [13.08° N, 80.27° E]
          </span>
        </motion.div>

        <motion.hr
          variants={lineExpand}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-5 origin-left border-[#e0e0e0]"
        />

        {/* ── Main Two-Column Layout ── */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-[1.2fr_1fr]">
          {/* Left Column */}
          <div>
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-[40px] sm:text-[56px] lg:text-[72px] font-black leading-[0.95] tracking-tighter"
            >
              DIVIT PERIWAL
            </motion.h1>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-5 flex flex-wrap items-center gap-3"
            >
              <span className="inline-block bg-[#1a1a1a] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white">
                SOFTWARE DEVELOPER
              </span>
              <a
                href="https://drive.google.com/file/d/15VzAwt7YjXu40NSzR-So5ggSLYVIOHvW/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#1a1a1a] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Resume
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 sm:mt-14 max-w-[420px] font-serif text-[22px] sm:text-[28px] leading-[1.3] italic text-[#444]"
            >
              Engineering decisions matter more than technologies. Good
              architecture outlives every framework.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10 sm:mt-14 border-l-[3px] border-[#e53e3e] pl-4 sm:pl-6"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                  ABOUT ME
                </h3>
                {/* Subtle avatar — grayscale → color on hover */}
                <div className="group/avatar relative">
                  <Image
                    src="/avatar.jpeg"
                    alt="Divit Periwal"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-[#ddd] object-cover grayscale opacity-60 transition-all duration-300 group-hover/avatar:grayscale-0 group-hover/avatar:opacity-100 group-hover/avatar:scale-110 group-hover/avatar:shadow-md"
                  />
                </div>
              </div>
              <p className="mt-3 font-sans text-[13px] leading-[1.8] text-[#666]">
                CS undergraduate at SRM University with a strong interest in
                backend systems, web development, and writing clean,
                maintainable code. I like building side projects that solve real
                problems.
              </p>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="pt-1">
            {/* Info Grid */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-x-8 gap-y-5"
            >
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                  Focus
                </h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#333]">
                  Backend systems, full-stack applications, system design
                </p>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                  Stack
                </h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#333]">
                  TS · Node · Next · Postgres · Redis · Drizzle · Docker
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-5"
            >
              <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                Problems I Solve
              </h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#333]">
                Concurrency · Caching · Bottlenecks · Abstractions · Reliability
                · API design · Optimization
              </p>
            </motion.div>

            {/* Capabilities */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-6 sm:mt-8 border border-[#ddd] p-4 sm:p-6"
            >
              <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                Capabilities
              </h4>
              <div className="mt-4">
                {CAPABILITIES.map((cap, i) => (
                  <motion.div
                    key={cap}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.85 + i * 0.1,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-3 border-t border-[#eee] py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#333]"
                  >
                    <span className="text-[#999]">▸</span>
                    <span>{cap}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Separator ── */}
        <motion.hr
          variants={lineExpand}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-10 sm:mt-16 origin-left border-[#e0e0e0]"
        />

        {/* ── Network Activity / GitHub Contributions ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
              01.A — GITHUB CONTRIBUTIONS
            </h3>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
              <span>LESS</span>
              {COLORS.map((color, i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="ml-1">MORE</span>
            </div>
          </div>

          {/* Two-column: Grid + Stats */}
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:gap-10 lg:items-start">
            {/* Contribution grid — reversed on mobile so latest weeks show first */}
            <div className="overflow-x-auto">
              <div className="flex flex-row-reverse sm:flex-row gap-1">
                {Array.from({ length: 52 }, (_, c) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: c * 0.015,
                      ease: "easeOut",
                    }}
                    className="flex flex-col gap-1"
                  >
                    {Array.from({ length: 7 }, (_, r) => (
                      <div
                        key={r}
                        className="h-3.5 w-3.5 rounded-sm"
                        style={{ backgroundColor: COLORS[grid[r][c]] }}
                      />
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* GitHub Stats — desktop: constrained to grid height, beside grid */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden lg:flex lg:flex-col lg:justify-between"
              style={{ height: "calc(7 * 14px + 6 * 4px)" }}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                  TOTAL CONTRIBUTIONS
                </p>
                <p className="mt-1 font-mono text-[36px] font-bold leading-none text-[#1a1a1a]">
                  {totalContributions}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                  LAST CONTRIBUTION
                </p>
                <p className="mt-1 font-mono text-[36px] font-bold leading-none text-[#e53e3e]">
                  {lastContribution}
                </p>
              </div>
            </motion.div>
          </div>

          {/* GitHub Stats — mobile: horizontal row below grid */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 flex gap-8 lg:hidden"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                TOTAL CONTRIBUTIONS
              </p>
              <p className="mt-1 font-mono text-[24px] font-bold leading-none text-[#1a1a1a]">
                {totalContributions}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                LAST CONTRIBUTION
              </p>
              <p className="mt-1 font-mono text-[24px] font-bold leading-none text-[#e53e3e]">
                {lastContribution}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Separator ── */}
        <motion.hr
          variants={lineExpand}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-10 sm:mt-16 origin-left border-[#e0e0e0]"
        />

        {/* ── Quick Stats ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-8 sm:mt-10"
        >
          <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
            01.B — QUICK STATS
          </h3>

          {/* Unified Stats Container */}
          <div className="mt-5 border border-[#e0e0e0]">
            {/* Stat Numbers Row */}
            <div className="grid grid-cols-4 divide-x divide-[#e0e0e0]">
              {STATIC_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="px-2 py-3 sm:px-4 sm:py-4 text-center"
                >
                  <p className="font-mono text-[20px] sm:text-[28px] font-bold leading-none text-[#1a1a1a]">
                    {stat.value ?? totalCommits}
                  </p>
                  <p className="mt-1.5 font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.12em] text-[#999]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Tech Stack Row */}
            <div className="border-t border-[#e0e0e0] px-4 py-3 sm:px-5">
              <div className="flex flex-wrap gap-1.5">
                {TECH_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="border border-[#e0e0e0] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#555]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Currently Exploring Row */}
            <div className="border-t border-[#e0e0e0] px-4 py-3 sm:px-5 flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1.5 mr-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#999]">
                  Learning
                </span>
              </div>
              {CURRENTLY_LEARNING.map((item) => (
                <span
                  key={item}
                  className="border border-dashed border-[#ccc] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#444]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── End Separator ── */}
        <motion.hr
          variants={lineExpand}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-10 sm:mt-14 origin-left border-[#e0e0e0]"
        />

        {/* ── Scroll Indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-6 sm:mt-8 flex flex-col items-center gap-3 pb-32 sm:pb-4"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
            SCROLL TO EXPLORE
          </div>
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-4 w-4 text-[#999]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}
