"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

interface TimelineEntry {
  id: number;
  type: "EXPERIENCE" | "EDUCATION";
  org: string;
  period: string;
  title: string;
  scope: string;
  points: string[];
  highlights: { metric: string; detail: string }[];
  status: { label: string; active: boolean };
  stack: string[];
  location: string;
}

const ENTRIES: TimelineEntry[] = [
  {
    id: 1,
    type: "EXPERIENCE",
    org: "PRAVAAH CONSULTING",
    period: "AUG 2024 – FEB 2025",
    title: "Software Developer Intern",
    scope: "Contributed to client-facing web applications and internal tooling at a growing consulting firm, working across the full stack in an agile environment.",
    points: [
      "Developed and shipped features for client-facing web applications using modern frameworks",
      "Collaborated with senior engineers on architecture decisions and code reviews",
      "Built internal tools that streamlined team workflows and reduced manual processes",
      "Gained hands-on experience working in a professional agile development cycle",
    ],
    highlights: [
      { metric: "Full Stack", detail: "end-to-end feature development from DB to UI" },
      { metric: "Agile", detail: "sprint-based delivery with daily standups and retrospectives" },
    ],
    status: { label: "CONCLUDED", active: false },
    stack: [],
    location: "IN",
  },
  {
    id: 2,
    type: "EDUCATION",
    org: "SRM_UNIVERSITY",
    period: "2024–2028",
    title: "B.Tech Computer Science",
    scope: "Pursuing a Bachelor of Technology in Computer Science with a focus on systems programming, distributed computing, and full-stack development.",
    points: [
      "Core coursework in Data Structures, Algorithms, Operating Systems, and Computer Networks",
      "Self-directed learning in backend architecture, cloud infrastructure, and DevOps",
      "Building side projects that apply classroom theory to real-world engineering problems",
      "Active in technical communities and hackathons",
    ],
    highlights: [
      { metric: "2024–28", detail: "4-year undergraduate program" },
      { metric: "CS", detail: "Computer Science & Engineering" },
    ],
    status: { label: "IN PROGRESS", active: true },
    stack: [],
    location: "CHENNAI",
  },
];

export default function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const cooldown = useRef(false);

  const entry = ENTRIES[activeIndex];

  const goToExperience = useCallback((dir: 1 | -1) => {
    const next = activeIndexRef.current + dir;
    if (next < 0 || next >= ENTRIES.length || isTransitioning.current || cooldown.current)
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
  }, []);

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
        if (activeIndexRef.current >= ENTRIES.length - 1) return;
        e.preventDefault();
        e.stopPropagation();
        goToExperience(1);
      } else if (e.deltaY < 0) {
        if (activeIndexRef.current <= 0) return;
        e.preventDefault();
        e.stopPropagation();
        goToExperience(-1);
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
        if (activeIndexRef.current >= ENTRIES.length - 1) return;
        e.stopPropagation();
        goToExperience(1);
      } else if (deltaY < -SWIPE_MIN) {
        if (activeIndexRef.current <= 0) return;
        e.stopPropagation();
        goToExperience(-1);
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
  }, [goToExperience]);

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
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[20px] bg-linear-to-r from-transparent via-[#1a2332] to-transparent opacity-30" />

      <div className="mx-auto flex min-h-screen max-w-300 flex-col px-4 sm:px-6">
        {/* Header */}
        <div className="pt-10">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
              03 — JOURNEY
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#999]">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(ENTRIES.length).padStart(2, "0")}
            </p>
          </div>
          <div className="mt-3 flex gap-1.5">
            {ENTRIES.map((_, i) => (
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

        {/* Content */}
        <div className="flex flex-1 items-center py-4 sm:py-10">
          <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
            {/* ── LEFT: Persistent Timeline ── */}
            <div className="relative flex flex-col justify-center">
              {/* Vertical line */}
              <div className="absolute bottom-0 left-[11px] top-0 w-px bg-[#ddd] lg:left-[11px]" />

              <div className="relative flex flex-col gap-6 sm:gap-12">
                {ENTRIES.map((ent, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={ent.id}
                      onClick={() => {
                        if (i !== activeIndex) {
                          setDirection(i > activeIndex ? 1 : -1);
                          setActiveIndex(i);
                          activeIndexRef.current = i;
                        }
                      }}
                      className="group relative flex items-start gap-5 text-left"
                    >
                      {/* Node */}
                      <div className="relative z-10 flex flex-col items-center">
                        <span
                          className="block rounded-full border-2 transition-all duration-500"
                          style={{
                            width: isActive ? 22 : 12,
                            height: isActive ? 22 : 12,
                            borderColor: isActive ? "#1a2332" : "#ccc",
                            backgroundColor: isActive ? "#1a2332" : "#f5f4f0",
                            boxShadow: isActive
                              ? "0 0 0 4px rgba(26,35,50,0.1)"
                              : "none",
                          }}
                        />
                      </div>

                      {/* Label */}
                      <div
                        className="transition-all duration-500"
                        style={{
                          opacity: isActive ? 1 : 0.45,
                          transform: isActive
                            ? "translateX(0)"
                            : "translateX(-2px)",
                        }}
                      >
                        <p
                          className="font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-500"
                          style={{
                            color: isActive ? "#1a2332" : "#999",
                          }}
                        >
                          {ent.period}
                        </p>
                        <p
                          className="mt-1 text-[15px] font-bold leading-tight tracking-tight transition-colors duration-500"
                          style={{
                            color: isActive ? "#1a2332" : "#aaa",
                          }}
                        >
                          {ent.org.replace(/_/g, " ")}
                        </p>
                        <p
                          className="mt-0.5 text-[12px] transition-colors duration-500"
                          style={{
                            color: isActive ? "#666" : "#bbb",
                          }}
                        >
                          {ent.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT: In-Depth Role Detail ── */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={entry.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col justify-center"
              >
                {/* Meta + Title */}
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                  <span className="text-[#2563eb]">{entry.type}</span>
                  <span className="text-[#ddd]">/</span>
                  <span className="text-[#999]">{entry.org.replace(/_/g, " ")}</span>
                  <span className="text-[#ddd]">/</span>
                  <span className="text-[#999]">{entry.period}</span>
                </div>

                <h3 className="mt-5 font-sans text-[30px] sm:text-[40px] lg:text-[48px] font-black leading-[1.05] tracking-tighter text-[#1a1a1a]">
                  {entry.title}
                </h3>

                {/* Scope */}
                <p className="mt-4 text-[13px] leading-[1.8] text-[#888]">
                  {entry.scope}
                </p>

                {/* Separator */}
                <div className="my-4 sm:my-6 h-px w-full bg-[#e8e7e3]" />

                {/* Two columns: Details + Highlights */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
                  {/* What I Did / Coursework */}
                  <div>
                    <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#999]">
                      <span className="text-[#1a2332]">▸</span>{" "}
                      {entry.type === "EXPERIENCE" ? "WHAT I DID" : "FOCUS AREAS"}
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {entry.points.map((r, i) => (
                        <li key={i} className="flex gap-3 text-[12px] leading-[1.7] text-[#555]">
                          <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-[#ccc]" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Highlights */}
                  <div>
                    <h4 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#999]">
                      <span className="text-[#2563eb]">▸</span>{" "}
                      {entry.type === "EXPERIENCE" ? "KEY IMPACT" : "AT A GLANCE"}
                    </h4>
                    <div className="mt-4 space-y-4">
                      {entry.highlights.map((c, i) => (
                        <div key={i} className="flex items-baseline gap-3">
                          <span className="shrink-0 font-mono text-[22px] font-black leading-none text-[#1a2332]">
                            {c.metric}
                          </span>
                          <span className="text-[12px] leading-[1.6] text-[#777]">
                            {c.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Stack + Status */}
                <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#e8e7e3] pt-4 sm:pt-5">
                  {entry.stack.length > 0 && entry.stack.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase tracking-widest text-[#aaa]"
                    >
                      {t}
                    </span>
                  ))}

                  <span className={`${entry.stack.length > 0 ? 'ml-auto' : ''} flex items-center gap-1.5`}>
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: entry.status.active ? "#4ade80" : "#bbb",
                      }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#999]">
                      {entry.status.label}
                    </span>
                  </span>
                </div>

                {/* Mobile nav buttons */}
                <div className="mt-6 flex items-center justify-between lg:hidden">
                  <button
                    onClick={() => {
                      if (activeIndex > 0) {
                        setDirection(-1);
                        setActiveIndex(activeIndex - 1);
                        activeIndexRef.current = activeIndex - 1;
                      }
                    }}
                    disabled={activeIndex <= 0}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999] transition-colors disabled:opacity-30"
                  >
                    <svg className="h-3 w-3 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    PREV
                  </button>
                  <span className="font-mono text-[10px] text-[#ccc]">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(ENTRIES.length).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => {
                      if (activeIndex < ENTRIES.length - 1) {
                        setDirection(1);
                        setActiveIndex(activeIndex + 1);
                        activeIndexRef.current = activeIndex + 1;
                      }
                    }}
                    disabled={activeIndex >= ENTRIES.length - 1}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#999] transition-colors disabled:opacity-30"
                  >
                    NEXT
                    <svg className="h-3 w-3 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom nav hint */}
        <div className="flex items-center justify-center gap-3 pb-32 sm:pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#bbb]">
            {activeIndex < ENTRIES.length - 1
              ? "SCROLL TO CONTINUE"
              : "END"}
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
