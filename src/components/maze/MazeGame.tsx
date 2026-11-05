"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BlobMark from "@/components/ui/BlobMark";
import { MazeEngine, type Dir, type Hud, type Phase } from "./engine";

const BEST_KEY = "darter-maze-best";

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp: 0,
  w: 0,
  W: 0,
  ArrowRight: 1,
  d: 1,
  D: 1,
  ArrowDown: 2,
  s: 2,
  S: 2,
  ArrowLeft: 3,
  a: 3,
  A: 3,
};

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {}
}

// Confetti for a cleared maze, fixed so render stays pure.
const CONFETTI = Array.from({ length: 36 }, (_, i) => {
  const a = (i / 36) * Math.PI * 2;
  const dist = 120 + ((i * 53) % 90);
  return {
    x: Math.cos(a) * dist,
    y: Math.sin(a) * dist - 40,
    rotate: (i * 97) % 360,
    color: ["#ffc96b", "#6fd6e3", "#ff7a8f", "#7fe0b0", "#5b78ff", "#ff8a5c"][i % 6],
    delay: (i % 6) * 0.02,
  };
});

const RULES = [
  { title: "Move", body: "Arrow keys or WASD. On a phone, swipe the board or use the pad." },
  { title: "Eat the views", body: "Every dot is a view. Gold coins are worth 500." },
  { title: "Go viral", body: "Grab a lightning orb and the Skip bots run from you. Catch one for 2,000." },
];

export default function MazeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MazeEngine | null>(null);
  const bestRef = useRef(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState<Hud>({ score: 0, lives: 3, round: 1 });
  const [best, setBest] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const board = boardRef.current;
    if (!canvas || !board) return;

    const engine = new MazeEngine(canvas, {
      onPhase: (p, h) => {
        setPhase(p);
        if (p === "over") {
          const next = Math.max(bestRef.current, readBest(), h.score);
          bestRef.current = next;
          writeBest(next);
          setBest(next);
        }
      },
      onHud: setHud,
    });
    engineRef.current = engine;

    const ro = new ResizeObserver(([entry]) => engine.resize(entry.contentRect.width));
    ro.observe(board);
    const io = new IntersectionObserver(([entry]) => engine.setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(board);

    const onKey = (e: KeyboardEvent) => {
      const d = KEY_DIRS[e.key];
      if (d === undefined || !engine.wantsKeys()) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      e.preventDefault();
      engine.setDir(d);
    };
    const onVisibility = () => engine.setTabVisible(document.visibilityState === "visible");

    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const play = () => {
    const stored = readBest();
    if (stored > bestRef.current) {
      bestRef.current = stored;
      setBest(stored);
    }
    engineRef.current?.start();
  };

  const steer = (d: Dir) => engineRef.current?.setDir(d);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    swipe.current = { x: e.clientX, y: e.clientY };
    if (phase === "paused") engineRef.current?.resume();
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const start = swipe.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) < 18) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0);
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const endSwipe = () => {
    swipe.current = null;
  };

  return (
    <section id="maze" className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Bonus level</div>
            <h2 className="mt-4 font-display text-[14vw] font-black uppercase leading-[0.86] tracking-[-0.04em] sm:text-8xl lg:text-[7.5rem]">
              The
              <span className="text-chroma -mb-[0.16em] block pb-[0.24em] pr-[0.1em] font-serif font-semibold normal-case italic tracking-[-0.03em]">
                algorithm.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-mist sm:text-lg lg:justify-self-end lg:pb-4">
            Every feed is a maze. Eat the views, dodge the Skip bots, grab a Go Viral orb and turn the tables. This is what we
            do all day.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-12">
          <div className="mx-auto w-full max-w-[560px]">
            {/* Run HUD */}
            <div className="mb-3 flex items-center justify-between gap-3 px-1 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              <div>
                Score <span className="ml-1 tabular-nums text-paper">{String(hud.score).padStart(6, "0")}</span>
              </div>
              <div className="hidden min-[380px]:block">
                Best <span className="ml-1 tabular-nums text-paper">{String(Math.max(best, hud.score)).padStart(6, "0")}</span>
              </div>
              <div className="flex items-center gap-1" aria-label={`${hud.lives} lives left`}>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: i < hud.lives ? 1 : 0.7, opacity: i < hud.lives ? 1 : 0.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <BlobMark className="h-5 w-5" />
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Stage */}
            <div className="relative overflow-hidden rounded-[32px] border border-line bg-ink-2 p-2 shadow-[0_40px_120px_-40px_rgba(255,170,90,0.4)] sm:p-3">
              <div ref={boardRef} className="relative w-full" style={{ aspectRatio: "15 / 17" }}>
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full touch-none rounded-[22px]"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endSwipe}
                  onPointerCancel={endSwipe}
                  onPointerLeave={endSwipe}
                  aria-label="Maze game board"
                  role="img"
                />
                <Overlay phase={phase} hud={hud} onPlay={play} onResume={() => engineRef.current?.resume()} />
                {hud.round > 1 && (phase === "ready" || phase === "playing") && (
                  <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-lemon backdrop-blur">
                    Round {hud.round}
                  </div>
                )}
              </div>
            </div>

            <DPad onSteer={steer} />
          </div>

          <aside className="flex flex-col justify-center gap-3">
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-mist">How to play</div>
            {RULES.map((rule, i) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.08 }}
                className="rounded-3xl border border-line bg-white/[0.03] p-5"
              >
                <div className="font-display text-lg font-black uppercase tracking-tight">{rule.title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-mist sm:text-base">{rule.body}</p>
              </motion.div>
            ))}
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-dashed border-white/15 p-4 text-sm text-mist">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff7a59] font-mono text-xs font-black text-ink">
                ⏭
              </span>
              Skip bots are what happens when a video is boring. Don&apos;t let them catch you.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Overlay({
  phase,
  hud,
  onPlay,
  onResume,
}: {
  phase: Phase;
  hud: Hud;
  onPlay: () => void;
  onResume: () => void;
}) {
  return (
    <AnimatePresence>
      {phase === "idle" && (
        <Panel key="idle">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-lemon">Insert attention</div>
          <div className="mt-3 font-display text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl">
            Ready to <span className="text-chroma">run?</span>
          </div>
          <p className="mt-3 max-w-[16rem] text-sm text-mist">Arrow keys or WASD. Swipe on phones.</p>
          <ChunkyButton color="#ffc96b" onClick={onPlay} className="mt-6 px-10">
            Play
          </ChunkyButton>
        </Panel>
      )}

      {phase === "ready" && (
        <motion.div
          key="ready"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="rounded-full bg-ink/75 px-5 py-2 font-display text-xl font-black uppercase tracking-tight text-lemon backdrop-blur sm:text-2xl">
            Ready…
          </span>
        </motion.div>
      )}

      {phase === "paused" && (
        <Panel key="paused">
          <div className="font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Paused</div>
          <p className="mt-2 text-sm text-mist">Press an arrow key or tap to keep going.</p>
          <ChunkyButton color="#6fd6e3" onClick={onResume} className="mt-5 px-8">
            Resume
          </ChunkyButton>
        </Panel>
      )}

      {phase === "caught" && (
        <motion.div
          key="caught"
          initial={{ scale: 2.2, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: -6, x: [0, -8, 8, -5, 5, 0] }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 16, x: { duration: 0.45, delay: 0.15 } }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="font-display text-5xl font-black uppercase italic tracking-[-0.04em] text-[#ff7a59] drop-shadow-[0_6px_0_#140a24] sm:text-7xl">
            Skipped!
          </span>
        </motion.div>
      )}

      {phase === "over" && (
        <Panel key="over">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff7a59]">Game over</div>
          <div className="mt-3 font-display text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl">
            {hud.score.toLocaleString()}
          </div>
          <div className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-mist">views this run</div>
          <ChunkyButton color="#ff7a8f" onClick={onPlay} className="mt-6 px-8">
            Run it back
          </ChunkyButton>
        </Panel>
      )}

      {phase === "cleared" && (
        <motion.div
          key="cleared"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-2.5 w-1.5 rounded-sm"
              style={{ background: c.color }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: c.x, y: [0, c.y, c.y + 160], rotate: c.rotate + 360, opacity: [1, 1, 0] }}
              transition={{ duration: 1.8, delay: c.delay, ease: "easeOut" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0.3, rotate: -10 }}
            animate={{ scale: 1, rotate: -4 }}
            transition={{ type: "spring", stiffness: 380, damping: 12 }}
            className="text-center"
          >
            <div className="text-chroma font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] drop-shadow-[0_6px_0_#140a24] sm:text-6xl">
              Maze
              <br />
              cleared
            </div>
            <div className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-lime">Next round, faster</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex items-center justify-center rounded-[22px] bg-ink/70 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -10 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="flex flex-col items-center text-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ChunkyButton({
  children,
  onClick,
  color,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: string;
  className?: string;
}) {
  const shadow = shade(color, -0.45);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl py-3.5 font-display text-base font-black uppercase tracking-tight text-ink transition-[transform,box-shadow] duration-100 active:translate-y-[5px] sm:text-lg ${className ?? ""}`}
      style={{ background: color, boxShadow: `0 5px 0 ${shadow}` }}
      onMouseDown={(e) => (e.currentTarget.style.boxShadow = `0 0 0 ${shadow}`)}
      onMouseUp={(e) => (e.currentTarget.style.boxShadow = `0 5px 0 ${shadow}`)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 5px 0 ${shadow}`)}
    >
      {children}
    </button>
  );
}

const PAD: { dir: Dir; icon: LucideIcon; label: string; area: string }[] = [
  { dir: 0, icon: ArrowUp, label: "Up", area: "col-start-2 row-start-1" },
  { dir: 3, icon: ArrowLeft, label: "Left", area: "col-start-1 row-start-2" },
  { dir: 1, icon: ArrowRight, label: "Right", area: "col-start-3 row-start-2" },
  { dir: 2, icon: ArrowDown, label: "Down", area: "col-start-2 row-start-3" },
];

// On-screen pad for phones and tablets.
function DPad({ onSteer }: { onSteer: (d: Dir) => void }) {
  return (
    <div className="mx-auto mt-5 grid w-44 grid-cols-3 grid-rows-3 gap-1.5 lg:hidden">
      {PAD.map(({ dir, icon: Icon, label, area }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          onPointerDown={(e) => {
            e.preventDefault();
            onSteer(dir);
          }}
          className={`${area} flex aspect-square touch-none select-none items-center justify-center rounded-2xl border border-line bg-white/[0.06] text-paper transition-colors active:bg-white/20`}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
      <div className="col-start-2 row-start-2 flex items-center justify-center">
        <BlobMark className="h-7 w-7 opacity-70" />
      </div>
    </div>
  );
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const target = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const mix = (c: number) => Math.round((target - c) * p + c);
  const r = mix(n >> 16);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
