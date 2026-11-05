"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { markIntroDone } from "@/lib/intro";

const SEEN_KEY = "darter-intro-seen";
// Black, a title card, then the iris opens on the film. Times in ms from mount.
const PEEK_AT = 700;
const OPEN_AT = 1500;
const DONE_AT = 2250;

const subscribeNothing = () => () => {};

// Skip the curtain on repeat visits in the same session, and for reduced motion.
function readSkip() {
  try {
    if (sessionStorage.getItem(SEEN_KEY) === "1") return true;
  } catch {}
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Intro() {
  const skip = useSyncExternalStore(subscribeNothing, readSkip, () => false);
  const [finished, setFinished] = useState(false);
  const [phase, setPhase] = useState<"black" | "peek" | "open">("black");
  const [full, setFull] = useState(3000);

  useEffect(() => {
    if (skip) {
      markIntroDone();
      return;
    }
    const timers = [
      window.setTimeout(() => setPhase("peek"), PEEK_AT),
      window.setTimeout(() => {
        setFull(Math.ceil(Math.hypot(window.innerWidth, window.innerHeight)) + 80);
        setPhase("open");
        markIntroDone();
      }, OPEN_AT),
      window.setTimeout(() => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        setFinished(true);
      }, DONE_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [skip]);

  const skipNow = () => {
    setFinished(true);
    markIntroDone();
  };

  const size = phase === "black" ? 0 : phase === "peek" ? 150 : full;

  return (
    <AnimatePresence>
      {!skip && !finished && (
        <motion.div
          key="intro"
          onClick={skipNow}
          className="intro-fallback fixed inset-0 z-[110] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* The iris: a clear circle whose giant shadow is the black frame. */}
          <motion.div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ x: "-50%", y: "-50%", boxShadow: "0 0 0 300vmax #000" }}
            initial={{ width: 0, height: 0 }}
            animate={{ width: size, height: size }}
            transition={
              phase === "open"
                ? { duration: 0.75, ease: [0.7, 0, 0.2, 1] }
                : { type: "spring", stiffness: 260, damping: 18 }
            }
          >
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-gold"
              animate={{ opacity: phase === "peek" ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ boxShadow: "0 0 40px rgba(255,201,107,0.45)" }}
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-x-0 top-1/2 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: phase === "open" ? 0 : 1, y: phase === "black" ? -12 : 100 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-mist">DARTER presents</div>
            <div className="mt-2 font-serif text-2xl italic text-paper sm:text-3xl">a doom scroll</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
