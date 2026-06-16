"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ---------- Reveal: fade + rise when scrolled into view ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Magnetic: element drifts toward the cursor ---------- */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const reduce = useReducedMotion();

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- TiltCard: 3D tilt that follows the pointer ---------- */
export function TiltCard({
  children,
  className,
  max = 9,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const reduce = useReducedMotion();
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Counter: animates a leading number when in view ---------- */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? 1 : 0;
  const [display, setDisplay] = useState(target === null || reduce ? value : `0${suffix}`);

  useEffect(() => {
    if (!inView || target === null || reduce) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.2, 0.7, 0.3, 1] as const,
      onUpdate: (v) => setDisplay(`${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, target, suffix, decimals, reduce]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/* ---------- Cursor: glowing follower that reacts to [data-cursor] ---------- */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.4 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
    else return;

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-cursor]"));
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x, y }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{ width: hovering ? 46 : 14, height: hovering ? 46 : 14, opacity: hovering ? 0.25 : 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ translateX: "-50%", translateY: "-50%" }}
      />
    </motion.div>
  );
}
