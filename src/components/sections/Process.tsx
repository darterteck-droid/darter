"use client";

import { AnimatePresence, motion, useInView, useScroll, useSpring } from "motion/react";
import { BookOpen, Magnet, PartyPopper, Repeat, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { STEPS } from "@/lib/content";

const ICONS: LucideIcon[] = [Magnet, BookOpen, PartyPopper, Repeat];
const TINTS = ["#ffe14d", "#ff5fd2", "#4df3ff", "#b6ff5c"];

export default function Process() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 60%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });

  return (
    <section id="how" className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-mist">The formula. Every video we make runs on it.</div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Big flipping number, pinned while the steps scroll past (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 flex h-[70vh] flex-col justify-center">
              <div className="relative h-[17rem] overflow-hidden" style={{ perspective: 800 }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ y: "70%", rotateX: -70, opacity: 0 }}
                    animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                    exit={{ y: "-70%", rotateX: 70, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="text-chroma font-display text-[17rem] font-black leading-none tracking-[-0.06em]"
                  >
                    0{active + 1}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-4 flex gap-2">
                {STEPS.map((step, i) => (
                  <motion.span
                    key={step.title}
                    className="h-1.5 rounded-full"
                    animate={{ width: i === active ? 48 : 12, backgroundColor: i === active ? TINTS[i] : "rgba(255,255,255,0.15)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div ref={list} className="relative pl-8 sm:pl-12">
            <div className="absolute bottom-0 left-0 top-0 w-[2px] rounded bg-white/10">
              <motion.div className="bg-chroma absolute inset-0 origin-top rounded" style={{ scaleY: line }} />
            </div>
            {STEPS.map((step, i) => (
              <Step key={step.title} index={i} title={step.title} body={step.body} onActive={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ index, title, body, onActive }: { index: number; title: string; body: string; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const Icon = ICONS[index];
  const tint = TINTS[index];

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <div ref={ref} className="relative flex min-h-[62vh] items-center py-10 lg:min-h-[78vh]">
      <motion.span
        className="absolute -left-8 top-1/2 h-4 w-4 -translate-x-[7px] -translate-y-1/2 rounded-full border-2 border-ink sm:-left-12"
        animate={{ backgroundColor: inView ? tint : "#2a2640", scale: inView ? 1.3 : 1 }}
        style={{ boxShadow: inView ? `0 0 24px ${tint}` : "none" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <motion.div
          animate={inView ? { rotate: [0, -10, 10, -6, 0], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex h-16 w-16 items-center justify-center rounded-[22px]"
          style={{ background: `radial-gradient(circle at 35% 30%, ${tint}, ${tint}88 60%, ${tint}33)`, boxShadow: `0 16px 40px -12px ${tint}` }}
        >
          <Icon className="h-8 w-8 text-ink" strokeWidth={2.2} />
        </motion.div>
        <div className="mt-6 font-mono text-xs uppercase tracking-[0.25em] lg:hidden" style={{ color: tint }}>
          Step 0{index + 1}
        </div>
        <h3 className="mt-2 font-display text-5xl font-black uppercase tracking-[-0.03em] sm:text-7xl lg:mt-6">{title}</h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-mist sm:text-xl">{body}</p>
      </motion.div>
    </div>
  );
}
