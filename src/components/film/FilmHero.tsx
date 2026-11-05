"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BouncyText from "@/components/ui/BouncyText";
import { FILM } from "@/lib/content";
import { useIntroDone } from "@/lib/intro";
import { sfx } from "@/lib/sfx";
import { addViews, unlock } from "@/lib/views";

export default function FilmHero() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const ready = useIntroDone();
  const [sound, setSound] = useState(false);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bars = useTransform(scrollYProgress, [0, 0.45], ["9svh", "0svh"]);
  const filmScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.2]);
  const filmY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pause the film once it's scrolled away, resume when it's back.
  useEffect(() => {
    const el = video.current;
    const section = ref.current;
    if (!el || !section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    const el = video.current;
    if (!el) return;
    const next = !sound;
    setSound(next);
    el.muted = !next;
    if (next) {
      el.currentTime = 0;
      el.volume = 0.8;
      el.play().catch(() => {});
      sfx.pop();
      addViews(250, { x: e.clientX, y: e.clientY, label: "Sound on" });
      unlock("sound-on");
    }
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink"
      aria-label="DARTER. We demand the doom scroll."
    >
      {/* The film */}
      <motion.div className="absolute inset-0" style={{ scale: filmScale, y: filmY }}>
        <video
          ref={video}
          src={FILM.src}
          poster={FILM.poster}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            if (el.duration) setProgress(el.currentTime / el.duration);
          }}
        />
      </motion.div>

      {/* Grade */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="film-grade absolute inset-0" />
        <div className="vignette absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,20,0.82)_0%,rgba(7,11,20,0.35)_45%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      </div>

      {/* Letterbox, which opens up as you scroll */}
      <motion.div aria-hidden="true" className="letterbox top-0" style={{ height: bars }} />
      <motion.div aria-hidden="true" className="letterbox bottom-0" style={{ height: bars }} />

      {/* Copy */}
      <motion.div
        className="absolute inset-x-0 bottom-[11svh] z-[7] px-4 sm:px-8"
        style={{ y: copyY, opacity: fade }}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-black/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/80 backdrop-blur sm:text-[11px]"
          >
            <span className="a-flash h-1.5 w-1.5 rounded-full bg-[#ff4d4d] shadow-[0_0_10px_#ff4d4d]" />
            The engine is posting
          </motion.div>

          <h1 className="leading-[0.86]">
            <span className="block font-display text-[12.5vw] font-black uppercase tracking-[-0.035em] sm:text-[9vw] lg:text-[7.6vw]">
              <BouncyText text="We demand" play={ready} delay={0.3} />
            </span>
            <motion.span
              className="text-chroma -mt-[0.04em] block pb-[0.08em] pr-[0.12em] font-serif text-[14.5vw] font-semibold italic tracking-[-0.03em] sm:text-[10.5vw] lg:text-[9vw]"
              initial={{ opacity: 0, filter: "blur(14px)", y: 20 }}
              animate={ready ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
              transition={{ duration: 0.9, delay: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
            >
              the doom scroll.
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mt-5 flex flex-col gap-5 sm:mt-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <p className="max-w-md text-[15px] leading-snug text-paper/80 sm:text-lg">
              DARTER is an attention engine. It writes, animates and posts <span className="whitespace-nowrap">movie-quality</span>{" "}AI
              stories every day, for brands and faceless accounts. Not slop. Stories people can&apos;t scroll past.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={sound}
                data-cursor={sound ? "Mute" : "Listen"}
                className="group flex items-center gap-3 rounded-full border border-white/15 bg-black/40 py-2 pl-2 pr-4 text-left backdrop-blur transition-colors hover:border-gold/60"
              >
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
                  {!sound && <span className="absolute inset-0 animate-ping rounded-full bg-paper/40" />}
                  {sound ? <Volume2 className="relative h-4 w-4" /> : <VolumeX className="relative h-4 w-4" />}
                </span>
                <span className="leading-tight">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Now showing</span>
                  <span className="block font-serif text-lg italic text-paper">
                    {FILM.title} <span className="font-sans text-xs not-italic text-mist">{sound ? "sound on" : "tap for sound"}</span>
                  </span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Film progress, along the bottom bar */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[7] h-[2px] bg-white/10">
        <div className="h-full bg-gold/80" style={{ width: `${progress * 100}%` }} />
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute bottom-[2.5svh] right-4 z-[7] hidden sm:right-8 sm:block"
      >
        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 2.2 } }}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-mist"
            >
              Scroll. You will anyway.
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                ↓
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
