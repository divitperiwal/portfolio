"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

interface Project {
  id: number;
  year: string;
  role: string;
  category: string;
  name: string;
  subtitle: string;
  tech: string[];
  github: string;
  private?: boolean;
  live?: string;
  description: string;
  problems: { title: string; detail: string }[];
  fixes: { title: string; detail: string }[];
  lessons: string[];
  status: { label: string; active: boolean };
}

const PROJECTS: Project[] = [
  {
    id: 1,
    year: "2025",
    role: "SOLO DEV",
    category: "BACKEND SYSTEM",
    name: "VESTICO",
    subtitle: "Portfolio Advisory Platform",
    tech: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "AWS"],
    github: "https://github.com/divitperiwal/vestico",
    private: true,
    live: "https://vestico.divitperiwal.dev",
    description:
      "A system to track client portfolios and automatically execute periodic rebalancing strategies for real advisory workflows.",
    problems: [
      {
        title: "High Load from Recalculation",
        detail:
          "Every request recomputed portfolio state from scratch, leading to slow responses and unnecessary database pressure as usage grew.",
      },
      {
        title: "Unreliable External Execution",
        detail:
          "Broker API failures and expiring tokens could interrupt automated rebalancing mid-cycle, leaving the system in an inconsistent state.",
      },
    ],
    fixes: [
      {
        title: "Caching & Scheduled Processing",
        detail:
          "Used Redis caching and scheduled jobs to precompute portfolio state, replacing per-request computation with predictable batch runs.",
      },
      {
        title: "Fault-Tolerant Execution Layer",
        detail:
          "Implemented retry logic with automatic token regeneration and safeguards against duplicate executions during broker outages.",
      },
    ],
    lessons: [
      "Correctness matters more than speed in automated systems.",
      "External integrations must be treated as unreliable by default.",
      "Operating software is harder than writing it.",
    ],
    status: { label: "DEPLOYED", active: true },
  },
  {
    id: 2,
    year: "2025",
    role: "SOLO DEV",
    category: "WEB3 APPLICATION",
    name: "ETHERGRID",
    subtitle: "On-Chain Transaction Messaging App",
    tech: ["Next.js", "Ethers.js", "Solidity", "Zustand", "Tailwind"],
    github: "https://github.com/divitperiwal/ethergrid",
    live: "https://ethergrid.divitperiwal.dev",
    description:
      "A web application where users attach keywords and messages to Ethereum transactions. Data is stored on-chain and used to generate contextual GIF-based transaction receipts, turning transfers into verifiable and expressive records.",
    problems: [
      {
        title: "Blockchain State ≠ UI State",
        detail:
          "Transactions could remain pending, fail, or be replaced, causing the interface to show incorrect outcomes.",
      },
      {
        title: "Reliable Activity Reconstruction",
        detail:
          "History could not depend on frontend state — it had to be rebuilt from blockchain events while remaining understandable to users.",
      },
    ],
    fixes: [
      {
        title: "Event-Driven Transaction Lifecycle",
        detail:
          "Modeled transaction states based on confirmations and contract events rather than assuming success after submission.",
      },
      {
        title: "Keyword-Driven Media Generation",
        detail:
          "Stored keywords on-chain and deterministically mapped them to GIFs so visual output always matches verifiable transaction data.",
      },
    ],
    lessons: [
      "A distributed system must expose its states clearly.",
      "Verification builds trust more than instant feedback.",
      "UX can be expressive without losing correctness.",
    ],
    status: { label: "DEPLOYED", active: true },
  },
  {
    id: 3,
    year: "2025",
    role: "SOLO DEV",
    category: "AI / VOICE",
    name: "SECOND ROUND",
    subtitle: "AI Interview Simulator",
    tech: ["Next.js", "Tailwind CSS", "Vapi", "LLM APIs"],
    github: "https://github.com/divitperiwal/interview-prep",
    live: "https://interview-prep.divitperiwal.dev",
    description:
      "A web application that conducts spoken technical interviews and evaluates responses, simulating a real interviewer instead of a static question generator.",
    problems: [
      {
        title: "Real-Time Conversation Handling",
        detail:
          "Voice interviews required managing listening, thinking, and responding states — latency or overlap immediately broke the experience.",
      },
      {
        title: "Inconsistent AI Feedback",
        detail:
          "Raw LLM responses varied across runs, producing feedback that was hard to compare or trust.",
      },
    ],
    fixes: [
      {
        title: "Controlled Interaction Flow",
        detail:
          "Structured the interview into explicit phases (ask → listen → evaluate → respond) to keep conversations natural and predictable.",
      },
      {
        title: "Structured Evaluation Layer",
        detail:
          "Mapped AI outputs into fixed feedback categories (clarity, correctness, completeness) to make results consistent and comparable.",
      },
    ],
    lessons: [
      "Voice interfaces require timing control more than UI design.",
      "AI becomes useful only after constraining its output.",
      "Good interaction design reduces perceived intelligence errors.",
    ],
    status: { label: "DEPLOYED", active: true },
  },
];

export default function ProjectSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const cooldown = useRef(false);

  const project = PROJECTS[activeIndex];

  const goToProject = useCallback(
    (dir: 1 | -1) => {
      const next = activeIndexRef.current + dir;
      if (next < 0 || next >= PROJECTS.length || isTransitioning.current || cooldown.current)
        return false;
      isTransitioning.current = true;
      cooldown.current = true;
      setDirection(dir);
      setActiveIndex(next);
      activeIndexRef.current = next;
      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
      setTimeout(() => {
        cooldown.current = false;
      }, 800);
      return true;
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (cooldown.current || isTransitioning.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (e.deltaY > 0) {
        if (activeIndexRef.current >= PROJECTS.length - 1) return;
        e.preventDefault();
        e.stopPropagation();
        goToProject(1);
      } else if (e.deltaY < 0) {
        if (activeIndexRef.current <= 0) return;
        e.preventDefault();
        e.stopPropagation();
        goToProject(-1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cooldown.current || isTransitioning.current) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const SWIPE_MIN = 50;

      // Find the scrollable parent container (the overlay div)
      const scrollParent = el.closest("[class*='overflow-y-auto']") ?? el.parentElement;
      if (scrollParent && scrollParent !== el) {
        const atTop = scrollParent.scrollTop < 2;
        const atBottom =
          Math.abs(scrollParent.scrollHeight - scrollParent.scrollTop - scrollParent.clientHeight) < 2;

        // If the parent can still scroll in the swipe direction, let it scroll
        if (deltaY > SWIPE_MIN && !atBottom) return;
        if (deltaY < -SWIPE_MIN && !atTop) return;
      }

      if (deltaY > SWIPE_MIN) {
        // Swipe up → next project
        if (activeIndexRef.current >= PROJECTS.length - 1) return; // let parent handle
        e.stopPropagation();
        goToProject(1);
      } else if (deltaY < -SWIPE_MIN) {
        // Swipe down → prev project
        if (activeIndexRef.current <= 0) return; // let parent handle
        e.stopPropagation();
        goToProject(-1);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToProject]);

  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-screen bg-gradient-to-b from-[#f5f4f0] via-[#f3f2ee] to-[#f5f4f0] text-[#1a1a1a]"
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[20px] bg-linear-to-r from-transparent via-[#e53e3e] to-transparent opacity-30" />

      <div className="mx-auto flex min-h-screen max-w-300 flex-col px-4 sm:px-6">
        {/* Header */}
        <div className="pt-10">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
              02 — PROJECTS
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(PROJECTS.length).padStart(2, "0")}
            </p>
          </div>
          <div className="mt-3 flex gap-1.5">
            {PROJECTS.map((_, i) => (
              <div
                key={i}
                className="h-0.5 flex-1 transition-colors duration-500"
                style={{
                  backgroundColor: i <= activeIndex ? "#1a1a1a" : "#ddd",
                }}
              />
            ))}
          </div>
        </div>

        {/* Project Content */}
        <div className="flex flex-1 items-center py-4 sm:py-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={project.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="grid w-full grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
            >
              {/* ── LEFT: Project Identity ── */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                    <span className="text-[#4ade80]">◆</span>
                    <span>{project.year}</span>
                    <span className="text-[#ccc]">/</span>
                    <span>{project.role}</span>
                    <span className="text-[#ccc]">/</span>
                    <span>{project.category}</span>
                  </div>

                  <h2 className="mt-5 font-sans text-[36px] sm:text-[48px] lg:text-[56px] font-black leading-[0.92] tracking-tighter text-[#1a2332]">
                    {project.name.split("_").map((part, i) => (
                      <span key={i}>
                        {i > 0 && (
                          <>
                            <br />_{" "}
                          </>
                        )}
                        {part}
                      </span>
                    ))}
                  </h2>

                  <p className="mt-3 text-[15px] leading-relaxed text-[#555] font-medium">
                    {project.subtitle}
                  </p>

                  <p className="mt-5 sm:mt-7 text-[13px] leading-[1.85] text-[#888]">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="border border-[#ddd] bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#555]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Status + CTAs */}
                <div className="mt-6 sm:mt-10 flex flex-col gap-4">
                  {/* Status badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: project.status.active ? "#4ade80" : "#bbb",
                      }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
                      {project.status.label}
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {project.private ? (
                      <span
                        className="inline-flex items-center gap-2 border border-[#ccc] bg-[#f5f5f5] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999] cursor-default"
                        title="Source code is in a private repository"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Private Repo
                      </span>
                    ) : (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#1a1a1a] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#333]"
                      >
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        View Source
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-[#1a1a1a] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Live
                      </a>
                    )}
                  </div>
                </div>

                {/* Mobile nav buttons */}
                <div className="mt-6 flex items-center justify-between lg:hidden">
                  <button
                    onClick={() => goToProject(-1)}
                    disabled={activeIndex <= 0}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999] transition-colors disabled:opacity-30"
                  >
                    <svg className="h-3 w-3 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    PREV
                  </button>
                  <span className="font-mono text-[10px] text-[#ccc]">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => goToProject(1)}
                    disabled={activeIndex >= PROJECTS.length - 1}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999] transition-colors disabled:opacity-30"
                  >
                    NEXT
                    <svg className="h-3 w-3 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── RIGHT: Deep Dive ── */}
              <div className="flex flex-col gap-6 sm:gap-8">
                {/* Problems */}
                <div>
                  <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e53e3e]">
                    <span>▸</span> PROBLEMS ENCOUNTERED
                  </h4>
                  <div className="mt-4 space-y-4">
                    {project.problems.map((p, i) => (
                      <div
                        key={i}
                        className="border-l-[2px] border-[#e53e3e]/30 pl-4"
                      >
                        <h5 className="text-[13px] font-semibold text-[#1a1a1a]">
                          {p.title}
                        </h5>
                        <p className="mt-1 text-[12px] leading-[1.7] text-[#777]">
                          {p.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fixes */}
                <div>
                  <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4ade80]">
                    <span>▸</span> SOLUTIONS IMPLEMENTED
                  </h4>
                  <div className="mt-4 space-y-4">
                    {project.fixes.map((f, i) => (
                      <div
                        key={i}
                        className="border-l-[2px] border-[#4ade80]/30 pl-4"
                      >
                        <h5 className="text-[13px] font-semibold text-[#1a1a1a]">
                          {f.title}
                        </h5>
                        <p className="mt-1 text-[12px] leading-[1.7] text-[#777]">
                          {f.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lessons */}
                <div>
                  <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#999]">
                    <span>▸</span> LESSONS LEARNED
                  </h4>
                  <div className="mt-4 space-y-2.5">
                    {project.lessons.map((l, i) => (
                      <div
                        key={i}
                        className="flex gap-3 text-[12px] leading-[1.7] text-[#666]"
                      >
                        <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#bbb]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p>{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav hint */}
        <div className="flex items-center justify-center gap-3 pb-32 sm:pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#bbb]">
            {activeIndex < PROJECTS.length - 1
              ? "SCROLL TO NEXT PROJECT"
              : "SCROLL TO CONTINUE"}
          </p>
          <svg
            className="h-3.5 w-3.5 text-[#bbb]"
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
          </svg>
        </div>
      </div>
    </section>
  );
}
