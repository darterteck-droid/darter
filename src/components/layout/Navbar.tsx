"use client";

import Link from "next/link";
import { AnimatePresence, motion, useAnimate, useScroll, useSpring, useTransform } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect } from "react";
import BlobMark from "@/components/ui/BlobMark";
import { setSound, useSound } from "@/lib/sfx";
import { RANKS, formatViews, rankIndex, rankProgress, useGame } from "@/lib/views";

const LINKS = [
  { label: "Slice", href: "/#slice" },
  { label: "Film", href: "/#film" },
  { label: "Feed", href: "/#feed" },
  { label: "Engine", href: "/#engine" },
  { label: "Algorithm", href: "/#maze" },
];

function RollLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-mist transition-colors hover:bg-white/5 hover:text-paper"
    >
      <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-[140%]">{label}</span>
      <span
        aria-hidden="true"
        className="text-chroma absolute inset-x-0 top-1/2 block translate-y-[90%] text-center font-bold transition-transform duration-300 ease-out group-hover:-translate-y-1/2"
      >
        {label}
      </span>
    </Link>
  );
}

// Your views, your rank, and how far to the next one. Bursts fly into this.
function ViewsCounter() {
  const { views, lastGain, gainId } = useGame();
  const [scope, animate] = useAnimate();
  const rolling = useSpring(views, { stiffness: 90, damping: 22 });
  const full = useTransform(rolling, (v) => Math.round(v).toLocaleString());
  const short = useTransform(rolling, (v) => formatViews(Math.round(v)));
  const rank = RANKS[rankIndex(views)];
  const progress = rankProgress(views);

  useEffect(() => {
    rolling.set(views);
  }, [views, rolling]);

  useEffect(() => {
    const bump = () => {
      if (scope.current) animate(scope.current, { scale: [1, 1.14, 1] }, { duration: 0.28 });
    };
    window.addEventListener("views-bump", bump);
    return () => window.removeEventListener("views-bump", bump);
  }, [animate, scope]);

  return (
    <div
      ref={scope}
      id="views-counter"
      className="relative flex items-center gap-2.5 rounded-full bg-white/[0.06] py-1.5 pl-3 pr-3.5"
      title={`${views.toLocaleString()} views`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4d4d] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff4d4d]" />
      </span>
      <div className="leading-none">
        <div className="flex items-baseline gap-1.5">
          <motion.span className="font-display text-sm font-black tabular-nums sm:hidden">{short}</motion.span>
          <motion.span className="hidden font-display text-sm font-black tabular-nums sm:inline">{full}</motion.span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-mist">views</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gold">{rank.title}</span>
          <span className="relative h-[3px] w-10 overflow-hidden rounded-full bg-white/10 sm:w-14">
            <motion.span
              className="bg-chroma absolute inset-y-0 left-0 rounded-full"
              animate={{ width: `${Math.max(4, progress * 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </span>
        </div>
      </div>
      <AnimatePresence>
        {lastGain > 0 && (
          <motion.span
            key={gainId}
            initial={{ y: 4, opacity: 0 }}
            animate={{ y: -18, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, times: [0, 0.15, 0.7, 1] }}
            className="pointer-events-none absolute -top-1 right-2 font-mono text-[10px] font-bold text-lime"
          >
            ▲ +{formatViews(lastGain)}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.3 });
  const sound = useSound();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div style={{ scaleX: progress }} className="bg-chroma h-[3px] origin-left" />
      <div className="px-4">
        <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-2 rounded-full border border-line bg-ink/60 py-1.5 pl-3 pr-1.5 backdrop-blur-xl sm:mt-4">
          <Link href="/" className="group flex items-center gap-2.5" data-cursor="Hi!">
            <BlobMark className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            <span className="hidden font-display text-sm font-black tracking-tight min-[400px]:inline sm:text-base">DARTER</span>
          </Link>

          <div className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((link) => (
              <RollLink key={link.href} {...link} />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <ViewsCounter />
            <button
              type="button"
              onClick={() => setSound(!sound)}
              aria-label={sound ? "Turn sound off" : "Turn sound on"}
              aria-pressed={sound}
              data-cursor={sound ? "Mute" : "Sound"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-mist transition-colors hover:bg-white/10 hover:text-paper"
            >
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
