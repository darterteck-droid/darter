"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import BlobMark from "@/components/ui/BlobMark";
import { SHORTS } from "@/lib/content";
import ShortCard from "./ShortCard";

// Scroll down, the reel slides sideways. The section is exactly as tall as the
// sideways distance, so the pin releases right as the last card lands.
export default function Reel() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);
  const smoothX = useSpring(x, { stiffness: 140, damping: 28, mass: 0.4 });
  const velocity = useVelocity(smoothX);
  const skew = useSpring(useTransform(velocity, [-2500, 0, 2500], [7, 0, -7]), { stiffness: 200, damping: 30 });
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(SHORTS.length, Math.max(1, Math.round(p * (SHORTS.length - 1)) + 1)));
  });

  return (
    <section
      id="reel"
      ref={section}
      className="relative"
      style={{ height: distance ? `calc(100svh + ${distance}px)` : "100svh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(139,108,255,0.18),transparent_60%)]" />

        <div className="relative mx-auto mb-6 flex w-full max-w-6xl items-center justify-between px-4 sm:mb-10 sm:px-8">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-mist">
            <span className="a-flash h-2.5 w-2.5 rounded-full bg-[#ff3b3b] shadow-[0_0_12px_#ff3b3b]" />
            Now playing
          </div>
          <div className="flex items-center gap-3 font-mono text-xs tabular-nums text-mist">
            <span className="text-paper">{String(current).padStart(2, "0")}</span>
            <span className="relative h-[2px] w-16 overflow-hidden rounded bg-white/10 sm:w-28">
              <motion.span className="bg-chroma absolute inset-0 origin-left" style={{ scaleX: bar }} />
            </span>
            <span>{String(SHORTS.length).padStart(2, "0")}</span>
          </div>
        </div>

        <motion.div
          ref={track}
          style={{ x: smoothX, skewX: skew }}
          className="relative flex w-max items-center gap-5 pl-4 pr-[12vw] sm:gap-8 sm:pl-8"
        >
          <div className="w-[78vw] max-w-[440px] shrink-0 pr-4 sm:w-[440px]">
            <h2 className="font-display text-[13vw] font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              The <span className="text-chroma">reel.</span>
            </h2>
            <p className="mt-5 max-w-sm text-base text-mist sm:text-lg">
              <span className="whitespace-nowrap">Come-up</span> stories. Hero stories. Stupidly satisfying stuff. Hook in one second, payoff at the end, watch it again.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-dim">
              <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                →
              </motion.span>
              scroll
            </div>
          </div>

          {SHORTS.map((short) => (
            <ShortCard key={short.ep} short={short} />
          ))}

          <NextEpisode />
        </motion.div>
      </div>
    </section>
  );
}

function NextEpisode() {
  return (
    <div className="relative flex reel-card aspect-[9/16] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/20 bg-white/[0.03] p-6 text-center">
      <motion.div
        animate={{ y: [0, -26, 0], scaleY: [0.9, 1.08, 0.92], scaleX: [1.1, 0.95, 1.08] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ originY: 1 }}
      >
        <BlobMark className="h-16 w-16" />
      </motion.div>
      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">Ep 07</div>
      <div className="mt-2 font-display text-xl font-black">Rendering…</div>
      <p className="mt-2 text-sm text-mist">The next one&apos;s in the oven.</p>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="bg-chroma h-full w-1/3 rounded-full"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
