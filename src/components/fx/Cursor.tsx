"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

const INTERACTIVE = "[data-cursor], a, button, label, [role='button']";
const FINE = "(pointer: fine)";

function subscribeFine(callback: () => void) {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export default function Cursor() {
  // Only mice and trackpads get the custom cursor; touch keeps the default.
  const enabled = useSyncExternalStore(
    subscribeFine,
    () => window.matchMedia(FINE).matches,
    () => false,
  );
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      setHovering(!!el);
      setLabel(el?.getAttribute("data-cursor") ?? null);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLabel = (e: Event) => {
      const next = (e as CustomEvent<string | null>).detail;
      setLabel(next);
      setHovering(!!next);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("cursor-label", onLabel);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("cursor-label", onLabel);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 84 : hovering ? 56 : 34;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <motion.div
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-paper mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && !label ? 1 : 0, scale: pressed ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border-2 border-paper mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.82 : 1,
          backgroundColor: label ? "rgba(247,245,255,1)" : "rgba(247,245,255,0)",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
