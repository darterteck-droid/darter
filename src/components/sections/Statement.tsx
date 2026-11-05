"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { STATEMENT, STATEMENT_HIGHLIGHT } from "@/lib/content";

// Words light up one at a time as you scroll through. The last line glows.
const WORDS = [...STATEMENT.split(" "), ...STATEMENT_HIGHLIGHT.split(" ")];
const HIGHLIGHT_FROM = STATEMENT.split(" ").length;

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const words = WORDS;

  return (
    <section id="statement" ref={ref} className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,170,90,0.14),transparent_60%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="bokeh left-[10%] top-[20%] h-28 w-28" style={{ "--o": 0.22 } as React.CSSProperties} />
        <span className="bokeh right-[14%] top-[55%] h-20 w-20" style={{ "--c": "#ff9a52", "--o": 0.25, "--dur": "12s" } as React.CSSProperties} />
        <span className="bokeh left-[40%] bottom-[8%] h-14 w-14" style={{ "--c": "#6fd6e3", "--o": 0.2, "--dur": "16s" } as React.CSSProperties} />
      </div>
      <p className="relative mx-auto max-w-5xl font-display text-[8.4vw] font-black leading-[1.08] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
        {words.map((word, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            className={i >= HIGHLIGHT_FROM ? "text-chroma pr-[0.08em] font-serif font-semibold italic tracking-[-0.02em]" : undefined}
          >
            {word}
          </Word>
        ))}
      </p>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [14, 0]);
  return (
    <>
      <motion.span style={{ opacity, y }} className={`inline-block ${className ?? ""}`}>
        {children}
      </motion.span>{" "}
    </>
  );
}
