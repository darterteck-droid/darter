"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import BouncyText from "@/components/ui/BouncyText";
import { useIntroDone } from "@/lib/intro";
import { sfx } from "@/lib/sfx";
import { addViews, unlock } from "@/lib/views";
import Skyline from "./Skyline";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// Fixed star positions (integer LCG) so server and client render the same sky.
let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return Math.round(((seed - 1) / 2147483646) * 1000) / 1000;
};
const STARS = Array.from({ length: 46 }, () => ({
  left: `${(rand() * 100).toFixed(1)}%`,
  top: `${(rand() * 70).toFixed(1)}%`,
  size: Math.round(10 + rand() * 22) / 10,
  dur: `${(2 + rand() * 3).toFixed(2)}s`,
  delay: `${(rand() * 4).toFixed(2)}s`,
}));

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const ready = useIntroDone();
  const [boops, setBoops] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const topY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const bottomY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  const boop = (x: number, y: number) => {
    setBoops((b) => b + 1);
    sfx.boop();
    addViews(100, { x, y });
    unlock("first-boop");
  };

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[620px] overflow-hidden"
      aria-label="DARTER. Attention is the game."
    >
      {/* Backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
        <div className="absolute inset-x-0 bottom-[45%] h-[24vh] min-h-[140px]">
          <Skyline />
        </div>
        <div className="hero-floor" />
        {STARS.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-paper"
            style={
              {
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                "--dur": s.dur,
                "--delay": s.delay,
              } as React.CSSProperties
            }
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* 3D set. Sits between the two headline lines. */}
      <motion.div className="absolute inset-0 z-[2]" style={{ scale: sceneScale, opacity: fade }}>
        <HeroScene eventSource={ref} boops={boops} onBoop={boop} play={ready} />
      </motion.div>

      {/* Copy layers. No z-index on the wrapper, so each line stacks against the canvas. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-4 pb-6 pt-24 sm:px-8 sm:pb-8 sm:pt-28">
        <motion.div className="relative z-[1]" style={{ y: topY, opacity: fade }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-mist backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_#b6ff5c]" />
            AI animation studio
          </motion.div>
          <h1 className="font-display text-[12.3vw] font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-[9.6vw] lg:text-[9vw]">
            <BouncyText text="Attention" play={ready} delay={0.15} />
          </h1>
        </motion.div>

        <motion.div className="relative z-[3]" style={{ y: bottomY, opacity: fade }}>
          <div className="flex flex-col gap-5 lg:flex-row-reverse lg:items-end lg:justify-between">
            <p className="font-display text-[13vw] font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-[9.6vw] lg:text-right lg:text-[9vw]">
              <BouncyText text="is the game." play={ready} delay={0.55} letterClassName="text-chroma" />
            </p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="flex items-end justify-between gap-4 lg:block lg:max-w-xs lg:pb-3"
            >
              <p className="max-w-[17rem] text-[15px] leading-snug text-mist sm:max-w-xs sm:text-base">
                We make animated hero stories, <span className="whitespace-nowrap">come-up</span> stories and stupidly
                satisfying videos. Built to hook you in one second.
              </p>
              <BoopMeter boops={boops} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Nudge to boop, gone after the first one. */}
      <AnimatePresence>
        {ready && boops === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 2.2, type: "spring", stiffness: 300, damping: 18 } }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
            className="pointer-events-none absolute left-1/2 top-[38%] z-[4] ml-[17vw] hidden items-start gap-1 sm:ml-[12vw] sm:flex lg:ml-[9vw]"
          >
            <svg width="44" height="34" viewBox="0 0 44 34" fill="none" className="mt-2 -scale-x-100 text-lemon">
              <path d="M3 30C10 14 22 6 40 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M32 1L40 4L35 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="rotate-[-6deg] font-mono text-xs uppercase tracking-widest text-lemon">boop him</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function BoopMeter({ boops }: { boops: number }) {
  return (
    <div className="shrink-0 rounded-2xl border border-line bg-white/[0.04] px-3.5 py-2 backdrop-blur lg:mt-4 lg:inline-block">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Boops</div>
      <div className="relative h-7 overflow-hidden font-display text-xl font-black tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={boops}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`block ${boops > 0 ? "text-chroma" : "text-paper"}`}
          >
            {String(boops).padStart(3, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
