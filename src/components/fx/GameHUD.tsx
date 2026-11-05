"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ACHIEVEMENTS,
  RANKS,
  addViews,
  dismissRankUp,
  dismissToast,
  formatViews,
  removeBurst,
  unlock,
  useGame,
  type Burst,
  type Toast,
} from "@/lib/views";

const CANDY = ["#ffc96b", "#6fd6e3", "#ff7a8f", "#7fe0b0", "#ff9a52", "#fff1cf"];
const AREAS = ["slice", "film", "feed", "engine", "maze"];

export default function GameHUD() {
  const game = useGame();
  return (
    <>
      <SpeedLines />
      <Explorer />
      <div aria-live="polite" className="pointer-events-none fixed inset-0 z-[105]">
        {game.bursts.map((b) => (
          <FlyingBurst key={b.id} burst={b} />
        ))}
      </div>
      <Toasts toasts={game.toasts} />
      <RankUp rank={game.rankUp} views={game.views} />
    </>
  );
}

// "+250" pops where it was earned, then flies up into the nav counter.
function FlyingBurst({ burst }: { burst: Burst }) {
  const [target] = useState(() => {
    const el = document.getElementById("views-counter");
    if (!el) return { x: window.innerWidth - 80, y: 30 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  const color = CANDY[burst.id % CANDY.length];

  return (
    <motion.div
      className="absolute left-0 top-0 flex flex-col items-center whitespace-nowrap"
      style={{ translateX: "-50%", translateY: "-50%" }}
      initial={{ x: burst.x, y: burst.y, scale: 0.3, opacity: 0 }}
      animate={{
        x: [burst.x, burst.x, target.x],
        y: [burst.y, burst.y - 46, target.y],
        scale: [0.3, 1.15, 0.35],
        opacity: [0, 1, 0.6],
      }}
      transition={{ duration: 1.05, times: [0, 0.32, 1], ease: ["backOut", "easeIn"] }}
      onAnimationComplete={() => {
        removeBurst(burst.id);
        window.dispatchEvent(new Event("views-bump"));
      }}
    >
      {burst.label && (
        <span className="mb-0.5 rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-paper">
          {burst.label}
        </span>
      )}
      <span
        className="font-display text-2xl font-black sm:text-3xl"
        style={{ color, textShadow: `0 0 18px ${color}, 0 2px 0 #070b14` }}
      >
        +{formatViews(burst.amount)}
      </span>
    </motion.div>
  );
}

function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-12 z-[106] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const a = ACHIEVEMENTS[t.achievement];
          return (
            <motion.button
              key={t.id}
              type="button"
              layout
              onClick={() => dismissToast(t.id)}
              initial={{ y: 60, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/15 bg-ink-3/90 p-3 pr-5 text-left shadow-[0_20px_60px_-15px_rgba(255,170,90,0.45)] backdrop-blur-xl"
            >
              <motion.span
                initial={{ rotate: -30, scale: 0.4 }}
                animate={{ rotate: [0, -12, 12, 0], scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lemon text-ink shadow-[0_0_24px_rgba(255,201,107,0.6)]"
              >
                <Trophy className="h-6 w-6" strokeWidth={2.4} />
              </motion.span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-lemon">Achievement unlocked</span>
                <span className="block font-display text-base font-black leading-tight">{a.title}</span>
                <span className="block truncate text-sm text-mist">{a.body}</span>
              </span>
              <span className="text-chroma shrink-0 font-display text-sm font-black">+{formatViews(a.bonus)}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

const CONFETTI = Array.from({ length: 64 }, (_, i) => {
  const angle = (i / 64) * Math.PI * 2 + (i % 3) * 0.2;
  const dist = 180 + ((i * 53) % 260);
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 60,
    rotate: (i * 97) % 720 - 360,
    color: CANDY[i % CANDY.length],
    w: 8 + (i % 4) * 3,
    h: i % 2 ? 8 : 16,
    delay: (i % 8) * 0.012,
  };
});

function RankUp({ rank, views }: { rank: number | null; views: number }) {
  useEffect(() => {
    if (rank === null) return;
    const id = window.setTimeout(dismissRankUp, 3200);
    return () => clearTimeout(id);
  }, [rank]);

  const next = rank !== null ? RANKS[rank + 1] : undefined;

  return (
    <AnimatePresence>
      {rank !== null && (
        <motion.div
          key={rank}
          onClick={dismissRankUp}
          className="fixed inset-0 z-[107] flex items-center justify-center overflow-hidden bg-ink/75 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
          {/* Sunburst rays */}
          <motion.div
            className="absolute h-[160vmax] w-[160vmax] opacity-40"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,201,107,0.35) 0deg 8deg, transparent 8deg 22deg)",
              maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 rounded-sm"
              style={{ width: c.w, height: c.h, background: c.color }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.4 }}
              animate={{ x: c.x * 2.2, y: [0, c.y * 2.2, c.y * 2.2 + 420], rotate: c.rotate, opacity: [1, 1, 0], scale: 1 }}
              transition={{ duration: 2.4, delay: c.delay, ease: [0.15, 0.7, 0.4, 1] }}
            />
          ))}
          <div className="relative text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-lemon sm:text-sm"
            >
              Rank up
            </motion.div>
            <motion.div
              initial={{ scale: 0.2, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.15 }}
              className="text-chroma mt-3 font-display text-[13vw] font-black uppercase leading-[0.9] tracking-[-0.04em] sm:text-8xl"
            >
              {RANKS[rank].title}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-5 text-base text-mist sm:text-lg"
            >
              {views.toLocaleString()} views.{" "}
              {next ? `Next up: ${next.title} at ${formatViews(next.at)}.` : "You made it. Legend."}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const STREAKS = Array.from({ length: 18 }, (_, i) => ({
  left: i % 2 ? `${88 + ((i * 7) % 11)}%` : `${(i * 5) % 11}%`,
  height: 90 + ((i * 37) % 160),
  delay: `${((i * 0.13) % 0.9).toFixed(2)}s`,
  duration: `${(0.45 + ((i * 0.07) % 0.4)).toFixed(2)}s`,
  color: CANDY[i % CANDY.length],
}));

// Speed lines at the screen edges when you scroll fast.
function SpeedLines() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 40 });
  const opacity = useTransform(smooth, (v) => Math.min(0.9, Math.max(0, (Math.abs(v) - 900) / 2600)));

  useMotionValueEvent(smooth, "change", (v) => {
    if (Math.abs(v) > 4200) unlock("speed");
  });

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[44] overflow-hidden" style={{ opacity }}>
      {STREAKS.map((s, i) => (
        <span
          key={i}
          className="speed-streak absolute top-0 w-[2px] rounded-full"
          style={{
            left: s.left,
            height: s.height,
            animationDelay: s.delay,
            animationDuration: s.duration,
            background: `linear-gradient(to bottom, transparent, ${s.color}, transparent)`,
          }}
        />
      ))}
    </motion.div>
  );
}

// First look at each area pays a little, seeing them all unlocks Explorer.
function Explorer() {
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.has(id)) continue;
          seen.add(id);
          addViews(300);
          if (AREAS.every((a) => seen.has(a))) unlock("explorer");
        }
      },
      { threshold: 0.25 },
    );
    AREAS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
