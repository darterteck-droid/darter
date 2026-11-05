"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { REAL_THING } from "@/lib/content";
import { sfx } from "@/lib/sfx";
import { addViews, unlock } from "@/lib/views";
import { FRUITS, drawHalf, drawWhole, hitRadius, palette, type Fruit, type Half } from "./fruits";

type Point = { x: number; y: number; t: number };
type Drop = { x: number; y: number; vx: number; vy: number; r: number; color: string; life: number; max: number };
type Splat = { x: number; y: number; color: string; life: number; blobs: { dx: number; dy: number; r: number; drip: number }[] };
type Popup = { id: number; x: number; y: number; text: string; sub: string };

const TRAIL_MS = 140;
const COMBO_WINDOW = 450;
const MAX_DROPS = 260;
const MAX_SPLATS = 22;
const MAX_HALVES = 40;
const HINT_PATH = "M10 70 C70 10, 150 10, 210 40";

// Blade trail: warm white into gold into ember.
const CYAN = [255, 246, 228];
const PINK = [255, 196, 102];
const LEMON = [255, 128, 92];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const bladeColor = (k: number) => (k < 0.5 ? mix(CYAN, PINK, k * 2) : mix(PINK, LEMON, (k - 0.5) * 2));

function closestOnSegment(a: Point, b: Point, c: { x: number; y: number }) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const len2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((c.x - a.x) * abx + (c.y - a.y) * aby) / len2));
  return { x: a.x + abx * t, y: a.y + aby * t };
}

export default function FruitSlice() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [sliced, setSliced] = useState(0);
  const [best, setBest] = useState(0);
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stage || !canvas || !ctx) return;

    const game = {
      W: 0,
      H: 0,
      time: 0,
      active: 0,
      fruits: [] as Fruit[],
      halves: [] as Half[],
      drops: [] as Drop[],
      splats: [] as Splat[],
      trail: [] as Point[],
      down: false,
      last: null as Point | null,
      combo: 0,
      lastCutAt: 0,
      sliced: 0,
      best: 0,
      nextWave: 0.3,
      shake: 0,
      lastSfx: 0,
      uid: 0,
      started: false,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      game.W = stage.clientWidth;
      game.H = stage.clientHeight;
      canvas.width = Math.round(game.W * dpr);
      canvas.height = Math.round(game.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const baseRadius = () => Math.max(26, Math.min(game.W, game.H) * 0.075);
    const gravity = () => game.H * 1.7;

    // Fruit launches from below the stage and peaks somewhere in the top half.
    const spawnWave = () => {
      const intensity = Math.min(1, game.active / 40);
      const count = 1 + Math.floor(Math.random() * (2 + intensity * 2.5));
      const g = gravity();
      for (let i = 0; i < count; i++) {
        const kind = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        const r = baseRadius() * kind.size;
        const x = rand(game.W * 0.14, game.W * 0.86);
        const y = game.H + r + i * rand(10, 70);
        const apex = rand(game.H * 0.18, game.H * 0.5);
        const vy = -Math.sqrt(2 * g * (y - apex));
        const tUp = -vy / g;
        const targetX = rand(game.W * 0.25, game.W * 0.75);
        game.fruits.push({
          id: ++game.uid,
          kind,
          golden: Math.random() < 1 / 18,
          x,
          y,
          vx: ((targetX - x) / (2 * tUp)) * 0.9,
          vy,
          rot: rand(0, Math.PI * 2),
          vr: rand(-2.4, 2.4),
          r,
          seed: Math.floor(Math.random() * 1e9),
          shock: 0,
          blinkAt: game.time + rand(0.5, 3),
          blinkUntil: 0,
        });
      }
    };

    const cut = (f: Fruit, angle: number, at: { x: number; y: number }) => {
      game.fruits = game.fruits.filter((other) => other !== f);
      const now = performance.now();
      if (now - game.lastCutAt > COMBO_WINDOW) game.combo = 0;
      game.combo += 1;
      game.lastCutAt = now;
      game.sliced += 1;

      const pal = palette(f.kind, f.golden);
      const nx = -Math.sin(angle);
      const ny = Math.cos(angle);
      const push = rand(110, 170);
      for (const side of [1, -1] as const) {
        game.halves.push({
          kind: f.kind,
          golden: f.golden,
          x: f.x,
          y: f.y,
          vx: f.vx * 0.5 + nx * push * side,
          vy: Math.min(f.vy, 0) * 0.35 + ny * push * side - 60,
          rot: 0,
          vr: side * rand(1.5, 4),
          r: f.r,
          seed: f.seed,
          angle,
          side,
          life: 0,
        });
      }
      if (game.halves.length > MAX_HALVES) game.halves.splice(0, game.halves.length - MAX_HALVES);

      const dirX = Math.cos(angle);
      const dirY = Math.sin(angle);
      const scale = f.r / 40;
      for (let i = 0; i < 22; i++) {
        const a = rand(0, Math.PI * 2);
        const speed = rand(60, 360);
        const life = rand(0.5, 1);
        game.drops.push({
          x: f.x,
          y: f.y,
          vx: Math.cos(a) * speed + dirX * rand(80, 260),
          vy: Math.sin(a) * speed + dirY * rand(80, 260) - 120,
          r: rand(2, 6) * scale,
          color: i % 5 === 0 ? "#ffffff" : pal.juice,
          life,
          max: life,
        });
      }
      if (game.drops.length > MAX_DROPS) game.drops.splice(0, game.drops.length - MAX_DROPS);
      game.splats.push({
        x: f.x,
        y: f.y,
        color: pal.juice,
        life: 2.2,
        blobs: Array.from({ length: 7 }, () => ({
          dx: rand(-1, 1) * f.r * 0.9,
          dy: rand(-1, 1) * f.r * 0.7,
          r: rand(0.18, 0.5) * f.r,
          drip: rand(4, 18),
        })),
      });
      if (game.splats.length > MAX_SPLATS) game.splats.shift();

      const points = 250 * game.combo * (f.golden ? 5 : 1);
      const rect = canvas.getBoundingClientRect();
      addViews(points, {
        x: rect.left + at.x,
        y: rect.top + at.y,
        label: f.golden ? "Golden" : game.combo >= 3 ? `Combo x${game.combo}` : undefined,
      });
      unlock("first-slice");
      if (game.combo >= 3) unlock("combo-3");
      if (game.combo >= 5) unlock("combo-5");
      if (f.golden) unlock("golden");

      if (game.combo >= 3 && !game.reduced) game.shake = Math.min(16, 4 + game.combo * 2);
      if (now - game.lastSfx > 70) {
        game.lastSfx = now;
        sfx.slice();
        window.setTimeout(() => sfx.squish(), 45);
      }

      setSliced(game.sliced);
      if (game.combo > game.best) {
        game.best = game.combo;
        setBest(game.best);
      }
      if (!game.started) {
        game.started = true;
        setStarted(true);
      }
      if (game.combo >= 3 || f.golden) {
        const text =
          f.golden && game.combo < 3
            ? "Golden!"
            : game.combo >= 7
              ? "Unreal!"
              : game.combo >= 5
                ? "Juicy!"
                : `Combo x${game.combo}`;
        const id = ++game.uid;
        const x = Math.min(Math.max(at.x, 100), game.W - 100);
        setPopups((list) => [...list.slice(-2), { id, x, y: at.y, text, sub: `+${points.toLocaleString()}` }]);
        window.setTimeout(() => setPopups((list) => list.filter((p) => p.id !== id)), 950);
      }
    };

    // Pointer input. Mice slice just by moving fast; touch and pens slice while pressed.
    const local = (e: PointerEvent): Point => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() };
    };
    const onDown = (e: PointerEvent) => {
      game.down = true;
      game.combo = 0;
      game.lastCutAt = 0;
      const p = local(e);
      game.last = p;
      game.trail.push(p);
      if (e.pointerType !== "mouse") canvas.setPointerCapture(e.pointerId);
      if (!game.started) {
        game.started = true;
        setStarted(true);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!game.down && e.pointerType !== "mouse") return;
      const p = local(e);
      const prev = game.last;
      game.last = p;
      game.trail.push(p);
      if (game.trail.length > 48) game.trail.shift();
      for (const f of game.fruits) {
        if (Math.hypot(f.x - p.x, f.y - p.y) < f.r * 2.6) f.shock = 1;
      }
      if (!prev) return;
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 3 || dist / Math.max(1, p.t - prev.t) < 0.3) return;
      const angle = Math.atan2(dy, dx);
      for (const f of [...game.fruits]) {
        const hit = closestOnSegment(prev, p, f);
        if (Math.hypot(hit.x - f.x, hit.y - f.y) <= hitRadius(f)) cut(f, angle, hit);
      }
    };
    const onUp = () => {
      game.down = false;
      game.last = null;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onUp);

    const step = (dt: number) => {
      game.time += dt;
      game.active += dt;
      game.nextWave -= dt;
      if (game.nextWave <= 0) {
        spawnWave();
        game.nextWave = rand(1.0, 1.7) - Math.min(1, game.active / 40) * 0.35;
      }
      const g = gravity();
      for (const f of game.fruits) {
        f.vy += g * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rot += f.vr * dt;
        f.shock = Math.max(0, f.shock - dt * 2.2);
        if (game.time > f.blinkAt) {
          f.blinkUntil = game.time + 0.12;
          f.blinkAt = game.time + rand(2, 5);
        }
      }
      game.fruits = game.fruits.filter((f) => !(f.vy > 0 && f.y - f.r * 1.5 > game.H));
      for (const h of game.halves) {
        h.vy += g * dt;
        h.x += h.vx * dt;
        h.y += h.vy * dt;
        h.rot += h.vr * dt;
        h.life += dt;
      }
      game.halves = game.halves.filter((h) => h.y - h.r * 1.5 < game.H && h.life < 2.6);
      for (const d of game.drops) {
        d.vy += g * 0.8 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.life -= dt;
      }
      game.drops = game.drops.filter((d) => d.life > 0);
      for (const s of game.splats) {
        s.life -= dt;
        for (const b of s.blobs) b.dy += b.drip * dt;
      }
      game.splats = game.splats.filter((s) => s.life > 0);
      game.shake *= Math.pow(0.82, dt * 60);
    };

    const drawTrail = (now: number) => {
      game.trail = game.trail.filter((p) => now - p.t < TRAIL_MS);
      const pts = game.trail;
      if (pts.length < 2) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const k = i / (pts.length - 1);
          const fade = Math.max(0, 1 - (now - b.t) / TRAIL_MS);
          const [cr, cg, cb] = bladeColor(k);
          const w = 2 + k * 8;
          if (pass === 0) {
            ctx.lineWidth = w * 3;
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.16 * fade})`;
          } else if (pass === 1) {
            ctx.lineWidth = w;
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.9 * fade})`;
          } else {
            ctx.lineWidth = w * 0.35;
            ctx.strokeStyle = `rgba(255,255,255,${0.9 * fade * k})`;
          }
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, game.W, game.H);
      ctx.save();
      if (game.shake > 0.3) ctx.translate(rand(-1, 1) * game.shake, rand(-1, 1) * game.shake);
      for (const s of game.splats) {
        ctx.globalAlpha = Math.min(1, s.life / 0.8) * 0.5;
        ctx.fillStyle = s.color;
        for (const b of s.blobs) {
          ctx.beginPath();
          ctx.arc(s.x + b.dx, s.y + b.dy, b.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      for (const h of game.halves) drawHalf(ctx, h);
      for (const f of game.fruits) drawWhole(ctx, f, game.time);
      for (const d of game.drops) {
        const k = d.life / d.max;
        ctx.globalAlpha = Math.max(0, k);
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (0.5 + 0.5 * k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      drawTrail(now);
    };

    // Only run while the stage is on screen.
    let raf = 0;
    let last = 0;
    let running = false;
    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      step(dt);
      draw(now);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(stage);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, []);

  return (
    <section id="slice" className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">Play with your food</div>
            <h2 className="mt-4 font-display text-[14vw] font-black uppercase leading-[0.86] tracking-[-0.04em] sm:text-8xl lg:text-[7.5rem]">
              The
              <span className="text-chroma -mb-[0.16em] block pb-[0.24em] pr-[0.1em] font-serif font-semibold normal-case italic tracking-[-0.03em]">
                slice.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-mist sm:text-lg lg:justify-self-end lg:pb-4">
            Satisfying is a format. Fruit cuts, jungle builds, the stuff you watch three times and can&apos;t say why. Go on.
            Swipe. Chain them for combos, and keep an eye out for gold.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-5">
        <div
          ref={stageRef}
          className="relative h-[70svh] max-h-[760px] min-h-[440px] overflow-hidden rounded-[32px] border border-line bg-[#0b1220] shadow-[0_60px_140px_-50px_rgba(255,170,90,0.45)]"
        >
          {/* A kitchen at blue hour, lit by one warm pendant lamp */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#0e1830_0%,#0b1220_55%,#120d0b_100%)]" />
            <div className="absolute left-1/2 top-0 h-[85%] w-[90%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,196,110,0.32),rgba(255,160,80,0.08)_45%,transparent_70%)]" />
            <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-[60px] bg-[#1b1410] shadow-[0_10px_40px_rgba(255,190,100,0.8)]" />
            <div className="absolute left-1/2 top-5 h-2 w-16 -translate-x-1/2 rounded-full bg-[#ffe2a8] blur-[2px]" />
            <span className="bokeh left-[6%] top-[18%] h-20 w-20" style={{ "--c": "#ffc96b", "--o": 0.25, "--dur": "12s" } as React.CSSProperties} />
            <span className="bokeh right-[8%] top-[28%] h-14 w-14" style={{ "--c": "#ff9a52", "--o": 0.3, "--dur": "10s" } as React.CSSProperties} />
            <span className="bokeh left-[22%] top-[8%] h-10 w-10" style={{ "--c": "#6fd6e3", "--o": 0.25, "--dur": "15s" } as React.CSSProperties} />
            {/* Butcher block counter */}
            <div className="absolute inset-x-0 bottom-0 h-[16%] bg-[linear-gradient(180deg,#5a3a22_0%,#3d2716_40%,#24170d_100%)]">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-[#ffcf8a]/50" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_46px,rgba(0,0,0,0.18)_46px,rgba(0,0,0,0.18)_48px)]" />
            </div>
            <div className="vignette absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-[30vw] italic leading-none text-paper opacity-[0.045] lg:text-[19rem]">slice</span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none select-none"
            aria-label="Fruit slicing game. Swipe across the fruit to slice it."
          />

          <div className="pointer-events-none absolute left-4 top-4 flex gap-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:left-5 sm:top-5">
            <span className="rounded-full bg-ink/70 px-3 py-1.5 text-mist backdrop-blur">
              Sliced <span className="tabular-nums text-paper">{String(sliced).padStart(3, "0")}</span>
            </span>
            <span className="rounded-full bg-ink/70 px-3 py-1.5 text-mist backdrop-blur">
              Best <span className="text-paper">x{best}</span>
            </span>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mist backdrop-blur sm:right-5 sm:top-5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_#ffc96b]" />
            Golden = 5x
          </div>

          <AnimatePresence>
            {!started && (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="relative h-[90px] w-[220px]">
                  <svg width="220" height="90" viewBox="0 0 220 90" className="absolute inset-0 overflow-visible">
                    <defs>
                      <linearGradient id="slice-hint" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fff6e4" />
                        <stop offset="50%" stopColor="#ffc466" />
                        <stop offset="100%" stopColor="#ff805c" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={HINT_PATH}
                      stroke="url(#slice-hint)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                  <motion.span
                    className="absolute left-0 top-0 -ml-3 -mt-3 block h-6 w-6 rounded-full border-2 border-paper bg-paper/30"
                    style={{ offsetPath: `path("${HINT_PATH}")` }}
                    animate={{ offsetDistance: ["0%", "100%", "100%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="mt-3 font-serif text-3xl italic sm:text-5xl"
                >
                  Swipe to slice
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {popups.map((p) => (
              <motion.div
                key={p.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: p.x, top: p.y }}
                initial={{ scale: 0.3, rotate: -14, opacity: 0, y: 0 }}
                animate={{ scale: 1, rotate: -6, opacity: 1, y: -30 }}
                exit={{ opacity: 0, y: -70, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 420, damping: 14 }}
              >
                <div className="text-chroma whitespace-nowrap font-display text-4xl font-black uppercase tracking-tight drop-shadow-[0_6px_24px_rgba(255,150,80,0.65)] sm:text-6xl">
                  {p.text}
                </div>
                <div className="font-mono text-sm font-bold text-lemon">{p.sub}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

          <RealThing />
        </div>
      </div>
    </section>
  );
}

// One of ours, playing next to the game: the format the game is built on.
function RealThing() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="relative hidden h-[70svh] max-h-[760px] min-h-[440px] overflow-hidden rounded-[32px] border border-line bg-black lg:block lg:aspect-[9/16]">
      <video
        ref={ref}
        src={REAL_THING.video}
        poster={REAL_THING.poster}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        aria-label={REAL_THING.title}
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">The real thing</div>
        <div className="mt-1 font-serif text-2xl italic text-paper">{REAL_THING.title}</div>
        <p className="mt-1 text-sm text-mist">{REAL_THING.caption}</p>
      </figcaption>
      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper backdrop-blur">
        <span className="a-flash h-1.5 w-1.5 rounded-full bg-[#ff4d4d]" /> One of ours
      </span>
    </figure>
  );
}
