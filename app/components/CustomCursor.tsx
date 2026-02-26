"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const mouse = useRef({ x: -20, y: -20 });
  const rendered = useRef({ x: -20, y: -20 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isClickable =
        !!target.closest("button") ||
        !!target.closest("a") ||
        !!target.closest("[role='button']");
      setHovering(isClickable);
    };

    // Smooth lerp animation loop
    const animate = () => {
      const ease = 0.25;
      rendered.current.x += (mouse.current.x - rendered.current.x) * ease;
      rendered.current.y += (mouse.current.y - rendered.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${rendered.current.x}px, ${rendered.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  const size = hovering ? 12 : 10;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: hovering ? "#e53e3e" : "#1a1a1a",
        opacity: visible ? 1 : 0,
        transition: "width 0.15s, height 0.15s, margin 0.15s, background-color 0.15s, opacity 0.2s",
        willChange: "transform",
      }}
    />
  );
}
