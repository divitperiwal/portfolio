"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

// ── Constants ──
const TRANSITION_MS = 1100;
const COOLDOWN_MS = 1300;
const TOUCH_SWIPE_MIN = 50;
const LOADER_DURATION = 2200; // time before the intro screen fades out

const NAV_ITEMS = [
  { label: "ABOUT", section: 0 },
  { label: "PROJECTS", section: 1 },
  { label: "JOURNEY", section: 2 },
  { label: "CONNECT", section: 3 },
] as const;

/* ── Intro Loading Screen ── */
function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"loading" | "revealing" | "done">(
    "loading",
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const start = performance.now();
    const duration = LOADER_DURATION * 0.7; // bar fills in 70% of total time
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease out cubic
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Phase transitions
    const revealTimer = setTimeout(() => setPhase("revealing"), LOADER_DURATION * 0.75);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, LOADER_DURATION);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-[#fafafa]"
      style={{
        opacity: phase === "revealing" ? 0 : 1,
        transition: `opacity ${LOADER_DURATION * 0.25}ms ease-out`,
      }}
    >
      {/* Name */}
      <div
        className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#1a1a1a]"
        style={{
          opacity: progress > 0.05 ? 1 : 0,
          transform: `translateY(${progress > 0.05 ? 0 : 8}px)`,
          transition: "all 0.6s ease-out",
        }}
      >
        DIVIT PERIWAL
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-px w-48 overflow-hidden bg-[#e0e0e0]">
        <div
          className="h-full bg-[#1a1a1a]"
          style={{
            width: `${progress * 100}%`,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Loading text */}
      <div
        className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#bbb]"
        style={{
          opacity: progress > 0.1 ? 1 : 0,
          transition: "opacity 0.4s ease-out",
        }}
      >
        INITIALIZING PORTFOLIO
      </div>
    </div>
  );
}

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = React.Children.toArray(children);
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cooldownRef = useRef(false);

  // ── Shared transition helper ──
  const goToSection = useCallback(
    (target: number) => {
      if (
        cooldownRef.current ||
        isTransitioning ||
        target === active ||
        target < 0 ||
        target >= sections.length
      )
        return;

      cooldownRef.current = true;
      setIsTransitioning(true);
      setActive(target);

      setTimeout(() => {
        if (target === 0 && heroRef.current) {
          heroRef.current.scrollTop = heroRef.current.scrollHeight;
        }
        setIsTransitioning(false);
      }, TRANSITION_MS);

      // Extra cooldown so rapid scrolling can't queue another transition
      setTimeout(() => {
        cooldownRef.current = false;
      }, COOLDOWN_MS);
    },  
    [active, isTransitioning, sections.length],
  );

  const goToNext = useCallback(
    () => goToSection(active + 1),
    [active, goToSection],
  );

  const goToPrev = useCallback(
    () => goToSection(active - 1),
    [active, goToSection],
  );

  // ── Wheel & touch listeners ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // Block everything while transitioning / cooling down
      if (cooldownRef.current || isTransitioning) {
        e.preventDefault();
        return;
      }

      // Hero section — allow internal scroll, transition only at bottom
      if (active === 0 && heroRef.current) {
        const el = heroRef.current;
        const atBottom =
          Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2;

        if (e.deltaY > 0 && atBottom) {
          e.preventDefault();
          goToNext();
        }
        // Otherwise let hero scroll naturally
        return;
      }

      // Sections > 0 — allow internal scroll, transition at boundaries
      const el = overlayRefs.current[active - 1];
      if (el) {
        const atTop = el.scrollTop < 2;
        const atBottom =
          Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2;

        if (e.deltaY > 0 && atBottom) {
          e.preventDefault();
          goToNext();
        } else if (e.deltaY < 0 && atTop) {
          e.preventDefault();
          goToPrev();
        }
        // Otherwise let the section scroll naturally
        return;
      }

      e.preventDefault();
      if (e.deltaY < 0) goToPrev();
      else if (e.deltaY > 0) goToNext();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cooldownRef.current || isTransitioning) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;

      if (active === 0 && heroRef.current) {
        const el = heroRef.current;
        const atBottom =
          Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2;
        if (deltaY > TOUCH_SWIPE_MIN && atBottom) goToNext();
        return;
      }

      // Sections > 0 — only transition at scroll boundaries
      const el = overlayRefs.current[active - 1];
      if (el) {
        const atTop = el.scrollTop < 2;
        const atBottom =
          Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2;

        if (deltaY > TOUCH_SWIPE_MIN && atBottom) goToNext();
        else if (deltaY < -TOUCH_SWIPE_MIN && atTop) goToPrev();
        return;
      }

      if (deltaY > TOUCH_SWIPE_MIN) goToNext();
      else if (deltaY < -TOUCH_SWIPE_MIN) goToPrev();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [active, isTransitioning, goToNext, goToPrev]);

  // ── Keyboard navigation ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden"
    >
      {/* ── Intro Loader ── */}
      {!introComplete && <IntroLoader onComplete={handleIntroComplete} />}

      {/* ── Left Page Index (hidden on small screens) ── */}
      <nav
        aria-label="Section navigation"
        className="fixed left-5 top-1/2 z-60 hidden -translate-y-1/2 flex-col items-start gap-5 sm:flex sm:left-7"
        style={{ pointerEvents: "none" }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.section;
          return (
            <button
              key={item.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goToSection(item.section)}
              style={{ pointerEvents: "auto" }}
              className="group flex items-center gap-2.5"
            >
              {/* Tick / line indicator */}
              <span
                className="block transition-all duration-500 ease-out"
                style={{
                  width: isActive ? 20 : 8,
                  height: 2,
                  backgroundColor: isActive
                    ? "#1a1a1a"
                    : active === 0
                      ? "#ccc"
                      : "#999",
                  borderRadius: 1,
                }}
              />
              {/* Label */}
              <span
                className="font-mono text-[10px] uppercase tracking-[0.15em] transition-all duration-500"
                style={{
                  color: isActive
                    ? "#1a1a1a"
                    : active === 0
                      ? "#ccc"
                      : "#999",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Bottom Mobile Nav (visible on small screens only) ── */}
      <div className="fixed bottom-0 inset-x-0 z-60 flex sm:hidden items-center justify-around bg-white/90 backdrop-blur-md border-t border-[#e0e0e0] px-2 py-2 safe-bottom">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.section;
          return (
            <button
              key={item.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goToSection(item.section)}
              className="flex flex-col items-center gap-1 px-2 py-1"
            >
              <span
                className="block h-0.5 transition-all duration-300"
                style={{
                  width: isActive ? 16 : 0,
                  backgroundColor: "#1a1a1a",
                }}
              />
              <span
                className="font-mono text-[9px] uppercase tracking-widest transition-all duration-300"
                style={{
                  color: isActive ? "#1a1a1a" : "#999",
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hero section – scrollable internally */}
      <div
        ref={heroRef}
        className="absolute inset-0 overflow-y-auto"
        style={{
          transition: `opacity ${TRANSITION_MS}ms ease`,
          opacity: active === 0 ? 1 : 0.3,
        }}
      >
        {sections[0]}
      </div>

      {/* Overlay sections – rendered dynamically */}
      {sections.slice(1).map((section, i) => {
        const index = i + 1;
        return (
          <div
            key={index}
            ref={(el) => { overlayRefs.current[i] = el; }}
            className="absolute inset-0 overflow-x-hidden overflow-y-auto rounded-t-[20px] will-change-transform"
            style={{
              transform:
                active >= index ? "translateY(0)" : "translateY(100%)",
              transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              zIndex: index * 10,
              boxShadow:
                active >= index
                  ? "0 -20px 60px rgba(0,0,0,0.12)"
                  : "none",
            }}
          >
            {section}
          </div>
        );
      })}
    </div>
  );
}
