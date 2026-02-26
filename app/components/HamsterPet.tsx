"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type HamsterState = "idle" | "running-right" | "running-left" | "sitting";

/* ── Kawaii SVG Hamster ── */
function HamsterSprite({ state, frame }: { state: HamsterState; frame: number }) {
  const isRunning = state === "running-right" || state === "running-left";
  const flipX = state === "running-left";
  const bounce = isRunning ? (frame % 2 === 0 ? -1.5 : 0) : 0;
  const legCycle = isRunning ? frame % 2 : 0;
  const isSitting = state === "sitting";

  /* Slight body squash when sitting */
  const bodyScaleY = isSitting ? 0.92 : 1;
  const bodyScaleX = isSitting ? 1.06 : 1;

  return (
    <div
      style={{
        transform: `scaleX(${flipX ? -1 : 1}) translateY(${bounce}px)`,
        transition: "transform 0.12s ease",
        width: 36,
        height: 36,
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
      }}
    >
      <svg
        viewBox="0 0 36 36"
        width="36"
        height="36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Tail ── */}
        <path
          d={isSitting
            ? "M6 22 C2 20, 1 17, 4 15"
            : "M6 21 C2 19, 1 16, 4 14"
          }
          stroke="#d4915c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 0.2s" }}
        />

        {/* ── Back leg ── */}
        <ellipse
          cx="11"
          cy={legCycle === 0 ? 31 : 29.5}
          rx="3"
          ry="2.5"
          fill="#d4915c"
          style={{ transition: "cy 0.12s" }}
        />

        {/* ── Front leg ── */}
        <ellipse
          cx="24"
          cy={legCycle === 0 ? 29.5 : 31}
          rx="3"
          ry="2.5"
          fill="#d4915c"
          style={{ transition: "cy 0.12s" }}
        />

        {/* ── Body ── */}
        <ellipse
          cx="17"
          cy="23"
          rx={12 * bodyScaleX}
          ry={9 * bodyScaleY}
          fill="#f5b06b"
          style={{ transition: "rx 0.2s, ry 0.2s" }}
        />

        {/* ── Belly ── */}
        <ellipse
          cx="19"
          cy="25"
          rx={7 * bodyScaleX}
          ry={6 * bodyScaleY}
          fill="#fde2c0"
          style={{ transition: "rx 0.2s, ry 0.2s" }}
        />

        {/* ── Left ear ── */}
        <ellipse cx="11" cy="9" rx="4.5" ry="5" fill="#f5b06b" />
        <ellipse cx="11" cy="9" rx="2.5" ry="3" fill="#f2a0a0" />

        {/* ── Right ear ── */}
        <ellipse cx="25" cy="9" rx="4.5" ry="5" fill="#f5b06b" />
        <ellipse cx="25" cy="9" rx="2.5" ry="3" fill="#f2a0a0" />

        {/* ── Head ── */}
        <circle cx="18" cy="16" r="10" fill="#f5b06b" />

        {/* ── Face stripe ── */}
        <ellipse cx="18" cy="14" rx="4" ry="5" fill="#e6a05a" opacity="0.35" />

        {/* ── Eyes ── */}
        {isSitting ? (
          /* Sleeping eyes (closed curves) */
          <>
            <path d="M13 15 Q14.5 13.5, 16 15" stroke="#3a2a1a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M20 15 Q21.5 13.5, 23 15" stroke="#3a2a1a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          /* Open eyes with shine */
          <>
            <circle cx="14" cy="15" r="2.2" fill="#1a1a1a" />
            <circle cx="22" cy="15" r="2.2" fill="#1a1a1a" />
            <circle cx="14.8" cy="14" r="0.8" fill="#fff" />
            <circle cx="22.8" cy="14" r="0.8" fill="#fff" />
          </>
        )}

        {/* ── Nose ── */}
        <ellipse cx="18" cy="18" rx="1.4" ry="1" fill="#e87b7f" />

        {/* ── Mouth ── */}
        <path d="M16.5 19.5 Q18 20.8, 19.5 19.5" stroke="#d4735a" strokeWidth="0.7" strokeLinecap="round" fill="none" />

        {/* ── Cheek blush ── */}
        <ellipse cx="10.5" cy="18" rx="2.5" ry="1.5" fill="#f7b8a0" opacity="0.5" />
        <ellipse cx="25.5" cy="18" rx="2.5" ry="1.5" fill="#f7b8a0" opacity="0.5" />

        {/* ── Whiskers ── */}
        <line x1="8" y1="17" x2="3" y2="16" stroke="#d4915c" strokeWidth="0.5" opacity="0.4" />
        <line x1="8" y1="19" x2="3" y2="20" stroke="#d4915c" strokeWidth="0.5" opacity="0.4" />
        <line x1="28" y1="17" x2="33" y2="16" stroke="#d4915c" strokeWidth="0.5" opacity="0.4" />
        <line x1="28" y1="19" x2="33" y2="20" stroke="#d4915c" strokeWidth="0.5" opacity="0.4" />

        {/* ── Sleeping zzz ── */}
        {isSitting && (
          <text
            x="30"
            y="8"
            fontFamily="monospace"
            fontSize="6"
            fill="#999"
            opacity={frame % 2 === 0 ? 1 : 0.3}
          >
            z
          </text>
        )}
      </svg>
    </div>
  );
}

export default function HamsterPet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 100, y: 100 });
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [state, setState] = useState<HamsterState>("idle");
  const [frame, setFrame] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragTarget = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const stopped = useRef(false);
  const [isStopped, setIsStopped] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const rafRef = useRef<number>(0);

  // Detect desktop (no touch + wide enough viewport)
  useEffect(() => {
    const check = () => {
      const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const isWide = window.innerWidth >= 1024;
      setIsDesktop(!isTouch && isWide);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track mouse position
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  // Animation frame counter
  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => f + 1), 200);
    return () => clearInterval(interval);
  }, []);

  // Main movement loop
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) return;

    const animate = () => {
      if (dragging.current) {
        // Lerp toward drag target with same ease as custom cursor
        const ease = 0.25;
        const cx = posRef.current.x;
        const cy = posRef.current.y;
        const tx = dragTarget.current.x;
        const ty = dragTarget.current.y;
        const nx = cx + (tx - cx) * ease;
        const ny = cy + (ty - cy) * ease;
        posRef.current = { x: nx, y: ny };
        setPos({ x: nx, y: ny });
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // If stopped, just stay in place
      if (stopped.current) {
        setState("sitting");
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const hx = posRef.current.x;
      const hy = posRef.current.y;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const dx = mx - hx;
      const dy = my - hy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        setState(dist < 50 ? "sitting" : "idle");
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const speed = Math.min(dist * 0.018, 2.2);
      const nx = hx + (dx / dist) * speed;
      const ny = hy + (dy / dist) * speed;

      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });
      setState(dx > 0 ? "running-right" : "running-left");

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    didDrag.current = false;
    dragOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    dragTarget.current = { x: posRef.current.x, y: posRef.current.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setState("idle");
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const nx = e.clientX - dragOffset.current.x;
    const ny = e.clientY - dragOffset.current.y;
    // Detect real drag (moved more than 4px from start)
    const movedDist = Math.abs(nx - dragTarget.current.x) + Math.abs(ny - dragTarget.current.y);
    if (!didDrag.current && movedDist > 4) didDrag.current = true;
    // Update drag target; the animation loop will lerp toward it
    dragTarget.current = { x: nx, y: ny };
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    if (!didDrag.current) {
      // It was a click, not a drag — toggle follow
      stopped.current = !stopped.current;
      setIsStopped(stopped.current);
      if (stopped.current) {
        setState("sitting");
      } else {
        setState("idle");
      }
      return;
    }
    // It was a drag
    setState("sitting");
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (!stopped.current) setState("idle");
    }, 1500);
  }, []);

  if (!isDesktop) return null;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="fixed z-[9990] select-none"
      style={{
        left: 0,
        top: 0,
        transform: `translate(${pos.x - 18}px, ${pos.y - 30}px)`,
        cursor: "grab",
        touchAction: "none",
      }}
    >
      <HamsterSprite state={state} frame={frame} />
    </div>
  );
}
