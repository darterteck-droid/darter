"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { RANKS, formatViews, rankIndex, useViews } from "@/lib/views";
import { formatClock, useWatchTime } from "@/lib/watch";

const LETTERS = ["D", "A", "R", "T", "E", "R"];
const HOVER_COLORS = ["#ffc96b", "#ff9a52", "#ff7a8f", "#6fd6e3", "#7fe0b0", "#fff1cf"];

// A pair of eyes peeking over the wordmark, watching the cursor.
function PeekEyes() {
  const ref = useRef<HTMLDivElement>(null);
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const x = useSpring(lx, { stiffness: 200, damping: 18 });
  const y = useSpring(ly, { stiffness: 200, damping: 18 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 200);
      lx.set((dx / d) * 6 * reach);
      ly.set((dy / d) * 6 * reach);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [lx, ly]);

  return (
    <div ref={ref} className="flex gap-1.5" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="a-blink svg-anim relative flex h-9 w-9 items-center justify-center rounded-full bg-paper sm:h-12 sm:w-12">
          <motion.div style={{ x, y }} className="h-4 w-4 rounded-full bg-ink sm:h-5 sm:w-5">
            <span className="ml-1 mt-1 block h-1.5 w-1.5 rounded-full bg-paper" />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// End credits. The engine did everything, and you're the star.
function Credits() {
  const views = useViews();
  const seconds = useWatchTime();
  const rows: [string, string][] = [
    ["Written by", "The Engine"],
    ["Animated by", "The Engine"],
    ["Posted by", "The Engine, daily"],
    ["Starring", `You, as ${RANKS[rankIndex(views)].title}`],
    ["Watch time", formatClock(seconds)],
    ["Views earned", formatViews(views)],
  ];
  return (
    <dl className="mx-auto mt-14 grid max-w-xl gap-3 sm:mt-20">
      {rows.map(([role, name], i) => (
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid grid-cols-2 items-baseline gap-5"
        >
          <dt className="text-right font-mono text-[10px] uppercase tracking-[0.25em] text-dim sm:text-xs">{role}</dt>
          <dd className="font-serif text-lg italic tabular-nums text-paper sm:text-2xl">{name}</dd>
        </motion.div>
      ))}
    </dl>
  );
}

export default function Footer() {
  return (
    <footer id="credits" className="relative overflow-hidden border-t border-line px-4 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,170,90,0.22),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-gold">The end</div>
          <p className="mt-4 font-serif text-5xl italic leading-[1.02] tracking-[-0.02em] sm:text-7xl">
            Thanks for watching.
          </p>
          <p className="mt-3 text-lg text-mist sm:text-xl">You&apos;re hooked. We know.</p>
        </div>

        <Credits />

        <div className="mt-12 flex justify-center">
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.94 }}
            data-cursor="Again"
            className="group flex items-center gap-2 rounded-full border border-line bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-widest text-paper"
          >
            Watch it again
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-1" />
          </motion.button>
        </div>

        <div className="relative mt-16 sm:mt-24">
          <div className="absolute -top-7 left-[41%] sm:-top-10">
            <PeekEyes />
          </div>
          <div
            className="flex select-none justify-between font-display text-[17.5vw] font-black leading-[0.8] tracking-[-0.05em] lg:text-[13rem]"
            aria-label="DARTER"
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="inline-block"
                initial={{ y: "60%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: i * 0.06 }}
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ y: "-14%", rotate: i % 2 ? 7 : -7, color: HOVER_COLORS[i] }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                >
                  {letter}
                </motion.span>
              </motion.span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 font-mono text-xs uppercase tracking-widest text-dim sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} DARTER L.L.C. We control the algorithm.</span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-paper">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
