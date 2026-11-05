"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { Clapperboard, Gauge, PenLine, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ENGINE_LOG, LANES, NOT_SLOP, PIPELINE, type EngineStage } from "@/lib/content";

const TINT: Record<EngineStage, string> = {
  write: "#ffc96b",
  animate: "#ff7a8f",
  post: "#6fd6e3",
  learn: "#7fe0b0",
};
const ICON = { write: PenLine, animate: Clapperboard, post: Send, learn: Gauge };
const KEEP = 7;

type Line = { id: number; at: string; stage: EngineStage; text: string };

const clock = () => new Date().toLocaleTimeString("en-US", { hour12: false });

export default function Engine() {
  const consoleRef = useRef<HTMLDivElement>(null);
  const live = useInView(consoleRef, { margin: "-10% 0px" });
  const [lines, setLines] = useState<Line[]>([]);
  const step = useRef(0);

  // The console prints a line every so often, but only while you can see it.
  useEffect(() => {
    if (!live) return;
    const push = () => {
      const entry = ENGINE_LOG[step.current % ENGINE_LOG.length];
      const id = ++step.current;
      setLines((list) => [...list.slice(-(KEEP - 1)), { id, at: clock(), ...entry }]);
    };
    if (step.current === 0) push();
    const t = window.setInterval(push, 1300);
    return () => window.clearInterval(t);
  }, [live]);

  const stage: EngineStage = lines.length ? lines[lines.length - 1].stage : "write";

  return (
    <section id="engine" className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,201,107,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">The engine</div>
            <h2 className="mt-4 font-display text-[14vw] font-black uppercase leading-[0.86] tracking-[-0.04em] sm:text-8xl lg:text-[7.5rem]">
              It just
              <span className="text-chroma -mb-[0.16em] block pb-[0.24em] pr-[0.1em] font-serif font-semibold normal-case italic tracking-[-0.03em]">
                posts.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-mist sm:text-lg lg:justify-self-end lg:pb-4">
            Pick a lane. The engine writes the hook, animates the story, posts it everywhere and reads what held attention. Then it
            does it again tomorrow. Without being asked.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
          {/* Live console */}
          <div
            ref={consoleRef}
            className="relative overflow-hidden rounded-[28px] border border-line bg-ink-2/90 shadow-[0_40px_120px_-40px_rgba(255,170,90,0.3)]"
          >
            <div className="sheen pointer-events-none absolute inset-0 opacity-40" />
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                darter / engine
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">Live demo</span>
            </div>

            <div className="relative h-[300px] overflow-hidden px-5 py-4 font-mono text-[11.5px] sm:h-[320px] sm:text-[13px]">
              <div className="absolute inset-x-5 bottom-4 flex flex-col gap-2.5">
                <AnimatePresence initial={false}>
                  {lines.map((line, i) => {
                    const age = lines.length - 1 - i;
                    return (
                      <motion.div
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                        animate={{ opacity: Math.max(0.18, 1 - age * 0.14), y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 28 }}
                        className="flex items-baseline gap-3"
                      >
                        <span className="shrink-0 tabular-nums text-dim">{line.at}</span>
                        <span
                          className="w-[4.6rem] shrink-0 text-[10px] font-bold uppercase tracking-[0.18em]"
                          style={{ color: TINT[line.stage] }}
                        >
                          {line.stage}
                        </span>
                        <span className="min-w-0 truncate text-paper/90">
                          {line.text}
                          {age === 0 && <span className="a-flash ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-gold" />}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Pipeline strip */}
            <div className="grid grid-cols-4 border-t border-line">
              {PIPELINE.map((p) => {
                const on = p.id === stage;
                const Icon = ICON[p.id];
                return (
                  <div key={p.id} className="relative flex flex-col items-center gap-1.5 px-2 py-4">
                    {on && (
                      <motion.span
                        layoutId="engine-stage"
                        className="absolute inset-x-2 top-0 h-[2px] rounded-full"
                        style={{ background: TINT[p.id], boxShadow: `0 0 16px ${TINT[p.id]}` }}
                      />
                    )}
                    <Icon className="h-4 w-4 transition-colors" style={{ color: on ? TINT[p.id] : "#6d7893" }} />
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
                      style={{ color: on ? "#fff6ea" : "#6d7893" }}
                    >
                      {p.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What each stage does */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {PIPELINE.map((p, i) => {
              const on = p.id === stage;
              const Icon = ICON[p.id];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, delay: i * 0.07 }}
                  className="relative overflow-hidden rounded-[24px] border p-4 transition-colors duration-500 sm:p-5"
                  style={{
                    borderColor: on ? `${TINT[p.id]}80` : "rgb(255 236 210 / 0.1)",
                    background: on ? `${TINT[p.id]}12` : "rgb(255 255 255 / 0.025)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: `${TINT[p.id]}22`, color: TINT[p.id] }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-dim">0{i + 1}</span>
                  </div>
                  <div className="mt-4 font-display text-lg font-black uppercase tracking-tight sm:text-2xl">{p.title}</div>
                  <p className="mt-1.5 text-[13px] leading-snug text-mist sm:text-sm">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Two lanes */}
        <div className="mt-4 grid gap-4 sm:mt-6 md:grid-cols-2 lg:gap-6">
          {LANES.map((lane, i) => (
            <motion.div
              key={lane.eyebrow}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ type: "spring", stiffness: 130, damping: 20, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-9"
            >
              <span
                aria-hidden="true"
                className="bokeh -right-10 -top-10 h-48 w-48 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ "--c": i === 0 ? "#ffc96b" : "#6fd6e3", "--o": 0.5 } as React.CSSProperties}
              />
              <div className="relative font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: i === 0 ? "#ffc96b" : "#6fd6e3" }}>
                {lane.eyebrow}
              </div>
              <h3 className="relative mt-4 font-serif text-3xl italic leading-[1.05] text-paper sm:text-5xl">{lane.title}</h3>
              <p className="relative mt-4 max-w-md text-base leading-relaxed text-mist sm:text-lg">{lane.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Not slop */}
        <div className="mt-16 grid gap-8 border-t border-line pt-10 sm:mt-24 sm:pt-14 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-20">
          <div className="font-display text-6xl font-black uppercase leading-[0.85] tracking-[-0.04em] sm:text-8xl">
            Not
            <br />
            <span className="relative inline-block">
              slop.
              <motion.span
                aria-hidden="true"
                className="absolute left-[-4%] top-[52%] h-[0.09em] w-[108%] origin-left rounded-full bg-rose"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.7, 0, 0.3, 1] }}
              />
            </span>
          </div>
          <ul className="grid gap-5 sm:gap-6">
            {NOT_SLOP.map((line, i) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4 text-lg leading-snug text-paper/90 sm:text-2xl"
              >
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-gold sm:h-6 sm:w-6" />
                {line}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
