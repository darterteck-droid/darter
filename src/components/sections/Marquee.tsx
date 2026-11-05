"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import BlobMark from "@/components/ui/BlobMark";
import { MARQUEE_BOTTOM, MARQUEE_TOP } from "@/lib/content";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// A row that drifts on its own and speeds up (or flips) with your scroll.
function VelocityRow({ children, baseVelocity }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0 flex-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="What we make" className="relative z-10 -mt-6 overflow-hidden py-16 sm:py-24">
      <div className="bg-chroma relative -mx-[5%] w-[110%] -rotate-[3deg] py-3 text-ink shadow-[0_20px_80px_-20px_rgba(255,170,90,0.55)] sm:py-5">
        <VelocityRow baseVelocity={-3}>
          {MARQUEE_TOP.map((word) => (
            <span key={word} className="flex items-center">
              <span className="px-5 font-display text-3xl font-black uppercase tracking-tight sm:px-8 sm:text-6xl">
                {word}
              </span>
              <BlobMark className="h-8 w-8 sm:h-12 sm:w-12" />
            </span>
          ))}
        </VelocityRow>
      </div>
      <div className="relative -mx-[5%] mt-6 w-[110%] rotate-[2deg] border-y border-line bg-ink-2 py-3 sm:mt-10 sm:py-5">
        <VelocityRow baseVelocity={2.5}>
          {MARQUEE_BOTTOM.map((word) => (
            <span key={word} className="flex items-center">
              <span className="text-outline px-5 font-display text-3xl font-black uppercase tracking-tight sm:px-8 sm:text-6xl">
                {word}
              </span>
              <span className="text-2xl text-lemon sm:text-4xl">✦</span>
            </span>
          ))}
        </VelocityRow>
      </div>
    </section>
  );
}
