"use client";

import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BEATS, FILM } from "@/lib/content";
import { sfx } from "@/lib/sfx";
import { addViews, unlock } from "@/lib/views";
import { formatClock } from "@/lib/watch";

const FALLBACK_DURATION = 45;

function beatAt(time: number) {
  let index = 0;
  BEATS.forEach((b, i) => {
    if (time >= b.at) index = i;
  });
  return index;
}

// The glow-up film, opened up beat by beat. Scroll in and the iris opens on it.
export default function Anatomy() {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const watched = useRef({ last: 0, pending: 0 });
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);

  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "center center"] });
  const radius = useTransform(scrollYProgress, [0.05, 1], [7, 75]);
  const clip = useMotionTemplate`circle(${radius}% at 50% 50%)`;
  const ring = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
  // circle() radius is a share of the box diagonal over root 2; this turns it into a width for a 16:9 box.
  const ringWidth = useTransform(radius, (r) => `${r * 1.622}%`);

  const active = beatAt(time);

  // Stop playing when it leaves the screen.
  useEffect(() => {
    const el = video.current;
    const box = frame.current;
    if (!el || !box) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !el.paused) el.pause();
    }, { threshold: 0.2 });
    io.observe(box);
    return () => io.disconnect();
  }, []);

  const play = (from?: number) => {
    const el = video.current;
    if (!el) return;
    if (typeof from === "number") el.currentTime = from;
    el.muted = false;
    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
    if (!started) {
      setStarted(true);
      sfx.pop();
    }
  };

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) play();
    else el.pause();
  };

  const onTime = () => {
    const el = video.current;
    if (!el) return;
    const now = el.currentTime;
    setTime(now);
    // Watch time pays: every five seconds actually watched earns views.
    const delta = now - watched.current.last;
    watched.current.last = now;
    if (delta > 0 && delta < 1.2 && !el.paused) {
      watched.current.pending += delta;
      if (watched.current.pending >= 5) {
        watched.current.pending -= 5;
        const r = frame.current?.getBoundingClientRect();
        addViews(150, r ? { x: r.left + r.width / 2, y: r.top + r.height * 0.4, label: "Watch time" } : undefined);
      }
    }
  };

  const seekFromBar = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    play(k * duration);
  };

  return (
    <section id="film" className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="bokeh left-[8%] top-[6%] h-40 w-40" style={{ "--o": 0.25 } as React.CSSProperties} />
        <span className="bokeh right-[12%] top-[14%] h-24 w-24" style={{ "--c": "#ff9a52", "--dur": "11s" } as React.CSSProperties} />
        <span className="bokeh right-[30%] top-[3%] h-16 w-16" style={{ "--c": "#fff1cf", "--o": 0.4, "--dur": "9s" } as React.CSSProperties} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
              Exhibit A · {FILM.kind} · {FILM.length}
            </div>
            <h2 className="mt-4 font-display text-[13vw] font-black uppercase leading-[0.86] tracking-[-0.04em] sm:text-8xl lg:text-[7.5rem]">
              The
              <span className="text-chroma -mb-[0.16em] block pb-[0.24em] pr-[0.1em] font-serif font-semibold normal-case italic tracking-[-0.03em]">
                glow-up.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-mist sm:text-lg lg:justify-self-end lg:pb-4">
            A real one we made for a med spa. Snubbed at the gala, rock bottom in the mirror, one business card, one glow-up,
            two jaws on the floor. Six beats in forty-five seconds. That&apos;s the formula.
          </p>
        </div>

        {/* The player, behind an iris */}
        <div ref={frame} className="relative mt-12 sm:mt-16">
          <motion.div
            style={{ clipPath: clip }}
            className="relative aspect-video overflow-hidden rounded-[22px] bg-black shadow-[0_60px_140px_-40px_rgba(255,170,90,0.35)] sm:rounded-[32px]"
          >
            <video
              ref={video}
              src={FILM.src}
              poster={FILM.poster}
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onClick={toggle}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || FALLBACK_DURATION)}
              onTimeUpdate={onTime}
              onEnded={() => {
                setPlaying(false);
                unlock("hooked");
              }}
              data-cursor={playing ? "Pause" : "Play"}
            />

            {/* Big play card before it starts, small one when paused */}
            <AnimatePresence>
              {!playing && (
                <motion.button
                  type="button"
                  onClick={() => play()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35 pb-12 sm:pb-0"
                  data-cursor="Play"
                  aria-label={started ? "Resume the film" : "Play the film with sound"}
                >
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-paper text-ink shadow-[0_0_60px_rgba(255,201,107,0.55)] sm:h-24 sm:w-24">
                    <span className="absolute inset-0 animate-ping rounded-full bg-paper/30" />
                    <Play className="relative ml-1 h-7 w-7 fill-current sm:h-10 sm:w-10" />
                  </span>
                  <span className="hidden font-serif text-xl italic text-paper sm:block sm:text-3xl">
                    {started ? "Keep watching" : "Watch it with sound"}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Timeline with the beats marked on it */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-2 pt-6 sm:px-6 sm:pb-5 sm:pt-10">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={playing ? "Pause" : "Play"}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-paper backdrop-blur transition-colors hover:bg-white/25"
                  >
                    {playing ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />}
                  </button>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold sm:text-xs"
                    >
                      {BEATS[active].label} · <span className="text-paper">{BEATS[active].name}</span>
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="font-mono text-[10px] tabular-nums text-mist sm:text-xs">
                  {formatClock(Math.floor(time))} / {formatClock(Math.round(duration))}
                </span>
              </div>
              <div
                className="group relative h-5 cursor-pointer"
                onPointerDown={seekFromBar}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(time)}
              >
                <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/20">
                  <div className="bg-chroma h-full rounded-full" style={{ width: `${(time / duration) * 100}%` }} />
                </div>
                {BEATS.map((b, i) => (
                  <span
                    key={b.id}
                    className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black ${
                      i <= active && time > 0 ? "bg-gold" : "bg-white/50"
                    }`}
                    style={{ left: `${(b.at / duration) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* A gold ring traces the iris while it opens */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ opacity: ring }}
          >
            <motion.span
              className="block aspect-square rounded-full border-2 border-gold/70 shadow-[0_0_50px_rgba(255,201,107,0.4)]"
              style={{ width: ringWidth }}
            />
          </motion.div>
        </div>

        {/* The beats */}
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {BEATS.map((b, i) => {
            const on = time > 0 && i === active;
            return (
              <li key={b.id}>
                <motion.button
                  type="button"
                  onClick={() => {
                    play(b.at);
                    frame.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  data-cursor="Jump"
                  className={`group block h-full w-full overflow-hidden rounded-2xl border text-left transition-colors ${
                    on ? "border-gold/70 bg-gold/[0.08]" : "border-line bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.still}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] tabular-nums text-paper backdrop-blur">
                      {formatClock(Math.floor(b.at))}
                    </span>
                    {on && <span className="absolute inset-0 ring-2 ring-inset ring-gold" />}
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                      0{i + 1} · {b.label}
                    </div>
                    <div className="mt-1 font-serif text-lg italic leading-tight text-paper sm:text-xl">{b.name}</div>
                    <p className="mt-1.5 text-[13px] leading-snug text-mist">{b.body}</p>
                  </div>
                </motion.button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
