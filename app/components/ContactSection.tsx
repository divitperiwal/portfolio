"use client";

import { useState, useEffect, useRef } from "react";
import * as motion from "motion/react-client";

/* ── Typing animation hook ── */
function useTypingAnimation(text: string, speed = 60, delay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

/* ── Live IST clock ── */
function useISTClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── Animation presets ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LINKS = [
  { label: "email", value: "divitperiwal@gmail.com", href: "mailto:divitperiwal@gmail.com" },
  { label: "github", value: "/divitperiwal", href: "https://github.com/divitperiwal" },
  { label: "linkedin", value: "/divitperiwal", href: "https://linkedin.com/in/divitperiwal" },
];

export default function ContactSection() {
  const istTime = useISTClock();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { displayed, done } = useTypingAnimation(
    "Ready to build something remarkable together.",
    50,
    600
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-screen bg-linear-to-br from-[#f2f1ec] via-[#efeee8] to-[#f2f1ec] text-[#1a1a1a]"
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[20px] bg-linear-to-r from-transparent via-[#1a2332] to-transparent opacity-30" />

      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-between px-4 sm:px-6">
        {/* ── Header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="pt-6 sm:pt-10"
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[#1a1a1a]">
            <span>04 — CONNECT</span>
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e]"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              />
              AVAILABLE
            </span>
          </div>
          <motion.hr
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-5 origin-left border-[#1a1a1a]"
          />
        </motion.div>

        {/* ── Main content ── */}
        <div className="flex flex-1 items-center py-4 sm:py-12">
          <div className="grid w-full grid-cols-1 gap-6 sm:gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
            {/* ── LEFT: Headline + Typing ── */}
            <div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="h-px w-6 bg-[#1a1a1a]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999]">
                  LET&apos;S CONNECT
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 sm:mt-8 font-serif text-[32px] font-normal leading-[1.1] tracking-tight sm:text-[58px] lg:text-[72px]"
              >
                Get in
                <br />
                <span className="italic">touch</span>
              </motion.h2>

              {/* Typing prompt */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-4 sm:mt-10 flex items-start font-mono text-[13px] leading-[1.7] text-[#666]"
              >
                <span className="mr-2 mt-0.5 text-[#22c55e]">›</span>
                <span>
                  {displayed}
                  {!done && (
                    <span className="cursor-blink ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-[#999]" />
                  )}
                </span>
              </motion.div>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-3 sm:mt-6 hidden sm:block max-w-[420px] text-[13px] leading-[1.85] text-[#999]"
              >
                I&apos;m currently open to discussing new software engineering
                challenges. Whether it&apos;s a collaboration, opportunity, or
                just a conversation about building great software — reach out.
              </motion.p>

              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-5 sm:mt-8 inline-flex items-center gap-2.5 border-2 border-[#1a1a1a] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white hover:shadow-lg"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </motion.a>
            </div>

            {/* ── RIGHT: Terminal-styled info card ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col justify-center"
            >
              {/* Terminal card */}
              <div className="rounded-lg border border-[#e4e3de] bg-[#fafaf8] p-4 sm:p-7 shadow-sm">
                {/* Terminal dots */}
                <div className="mb-3 sm:mb-5 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-[10px] text-[#ccc]">
                    connection.sh
                  </span>
                </div>

                <p className="font-mono text-[12px] font-semibold text-[#1a1a1a]">
                  /connection.open
                </p>

                <div className="mt-4 space-y-2.5">
                  <InfoRow label="status" value="available" valueColor="#22c55e" />
                  <InfoRow label="timezone" value="IST (UTC+5:30)" />
                  <InfoRow label="local_time" value={istTime || "—"} valueColor="#2563eb" />
                  <InfoRow label="response_time" value="< 24h" />
                  <InfoRow label="location" value="Chennai, India" />
                </div>

                <div className="my-3 sm:my-5 h-px bg-[#e4e3de]" />

                {/* Links */}
                <div className="space-y-2.5">
                  {LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center font-mono text-[11px] sm:text-[12px]"
                    >
                      <span className="w-20 sm:w-28 shrink-0 text-[#999]">{link.label}</span>
                      <span className="mr-2 sm:mr-3 text-[#ccc]">:</span>
                      <span className="font-medium text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#2563eb] truncate">
                        {link.value}
                      </span>
                      <svg
                        className="ml-2 h-3 w-3 -translate-x-1 text-[#ccc] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-[#2563eb] group-hover:opacity-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </a>
                  ))}
                </div>

                <div className="my-3 sm:my-5 h-px bg-[#e4e3de]" />

                {/* Cursor prompt */}
                <div className="flex items-center font-mono text-[12px] text-[#ccc]">
                  <span className="mr-2 text-[#22c55e]">›</span>
                  <span>awaiting_connection_</span>
                  <span className="cursor-blink ml-0.5 inline-block h-4 w-0.5 bg-[#ccc]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Footer ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-between border-t border-[#e4e3de] pb-32 sm:pb-8 pt-5"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ccc]">
            © 2026 DIVIT PERIWAL
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ccc]">
            BUILT WITH <span className="text-[#e53e3e]">❤</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Info Row ── */
function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center font-mono text-[11px] sm:text-[12px]">
      <span className="w-20 sm:w-28 shrink-0 text-[#999]">{label}</span>
      <span className="mr-2 sm:mr-3 text-[#ccc]">:</span>
      <span className="font-medium" style={{ color: valueColor || "#1a1a1a" }}>
        {value}
      </span>
    </div>
  );
}
