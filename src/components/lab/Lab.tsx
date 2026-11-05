"use client";

import { AnimatePresence, motion, useAnimate, useMotionValue, useSpring } from "motion/react";
import { Dices } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IDEA_GOAL, IDEA_WHAT, IDEA_WHO, NAME_FIRST, NAME_LAST } from "@/lib/content";
import { sfx } from "@/lib/sfx";
import { addViews, unlock } from "@/lib/views";

const COLORS = ["#ff6fb8", "#4df3ff", "#ffe14d", "#b6ff5c", "#8b6cff", "#ff7a59"] as const;
const BODIES = ["Round", "Tall", "Boxy"] as const;
const EYES = ["Big", "Sleepy", "Star", "Cyclops"] as const;
const MOUTHS = ["Grin", "Gasp", "Smirk", "Blep"] as const;
const TOPPERS = ["None", "Antenna", "Party", "Sprout"] as const;

type Body = (typeof BODIES)[number];
type Eyes = (typeof EYES)[number];
type Mouth = (typeof MOUTHS)[number];
type Topper = (typeof TOPPERS)[number];

const INK = "#1a0b24";

// Every body is the same four curves, so the outline morphs smoothly between shapes.
const SHAPES: Record<Body, { cx: number; cy: number; rx: number; ry: number; k: number }> = {
  Round: { cx: 150, cy: 186, rx: 100, ry: 94, k: 0.5523 },
  Tall: { cx: 150, cy: 166, rx: 80, ry: 114, k: 0.58 },
  Boxy: { cx: 150, cy: 189, rx: 98, ry: 91, k: 0.86 },
};

function bodyPath(b: Body) {
  const { cx, cy, rx, ry, k } = SHAPES[b];
  const f = (n: number) => n.toFixed(2);
  return [
    `M${f(cx)} ${f(cy - ry)}`,
    `C${f(cx + k * rx)} ${f(cy - ry)} ${f(cx + rx)} ${f(cy - k * ry)} ${f(cx + rx)} ${f(cy)}`,
    `C${f(cx + rx)} ${f(cy + k * ry)} ${f(cx + k * rx)} ${f(cy + ry)} ${f(cx)} ${f(cy + ry)}`,
    `C${f(cx - k * rx)} ${f(cy + ry)} ${f(cx - rx)} ${f(cy + k * ry)} ${f(cx - rx)} ${f(cy)}`,
    `C${f(cx - rx)} ${f(cy - k * ry)} ${f(cx - k * rx)} ${f(cy - ry)} ${f(cx)} ${f(cy - ry)}Z`,
  ].join(" ");
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

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const pickOther = <T,>(list: readonly T[], current: T) => {
  const rest = list.filter((x) => x !== current);
  return rest[Math.floor(Math.random() * rest.length)];
};

const spring = { type: "spring", stiffness: 260, damping: 17 } as const;

export default function Lab() {
  const [color, setColor] = useState<string>(COLORS[0]);
  const [body, setBody] = useState<Body>("Round");
  const [eyes, setEyes] = useState<Eyes>("Big");
  const [mouth, setMouth] = useState<Mouth>("Grin");
  const [topper, setTopper] = useState<Topper>("Antenna");
  const [name, setName] = useState("Sir Wobbles");
  const [idea, setIdea] = useState("A broke little robot who turns one lemonade stand into an empire.");

  const cast = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    sfx.click();
    unlock("cast");
  };

  const [jumpScope, animateJump] = useAnimate();
  const [spinScope, animateSpin] = useAnimate();
  const [shadowScope, animateShadow] = useAnimate();
  const busy = useRef(false);

  const jump = async () => {
    if (busy.current) return;
    busy.current = true;
    sfx.boop();
    const el = jumpScope.current;
    const sh = shadowScope.current;
    await animateJump(el, { y: 6, scaleY: 0.86, scaleX: 1.1 }, { duration: 0.12 });
    animateShadow(sh, { scale: 0.55, opacity: 0.15 }, { duration: 0.32, ease: "easeOut" });
    await animateJump(el, { y: -70, scaleY: 1.12, scaleX: 0.92 }, { duration: 0.32, ease: "easeOut" });
    animateShadow(sh, { scale: 1, opacity: 0.35 }, { duration: 0.28, ease: "easeIn" });
    await animateJump(el, { y: 0, scaleY: 1.05, scaleX: 0.96 }, { duration: 0.28, ease: "easeIn" });
    await animateJump(el, { scaleY: [0.8, 1.07, 1], scaleX: [1.16, 0.96, 1] }, { duration: 0.45 });
    busy.current = false;
  };

  const spin = async () => {
    sfx.whoosh();
    await animateSpin(spinScope.current, { rotate: [0, 360] }, { duration: 0.7, ease: [0.6, -0.3, 0.3, 1.3] });
  };

  const newIdea = () => {
    sfx.pop();
    setName(`${pick(NAME_FIRST)} ${pick(NAME_LAST)}`);
    setIdea(`${pick(IDEA_WHO)} ${pick(IDEA_WHAT)} ${pick(IDEA_GOAL)}`);
  };

  const shuffle = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      const r = e.currentTarget.getBoundingClientRect();
      addViews(150, { x: r.left + r.width / 2, y: r.top });
    }
    unlock("cast");
    setColor(pickOther(COLORS, color as (typeof COLORS)[number]));
    setBody(pickOther(BODIES, body));
    setEyes(pickOther(EYES, eyes));
    setMouth(pickOther(MOUTHS, mouth));
    setTopper(pickOther(TOPPERS, topper));
    newIdea();
    jump();
  };

  return (
    <section id="lab" className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-[-0.04em] sm:text-8xl lg:text-9xl">
            The <span className="text-chroma">lab.</span>
          </h2>
          <p className="max-w-xs text-base text-mist sm:pb-3 sm:text-right sm:text-lg">
            Every <span className="whitespace-nowrap">come-up</span> story needs a hero. Cast yours.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          {/* Stage */}
          <div className="relative overflow-hidden rounded-[32px] border border-line bg-ink-2">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-full w-[80%] -translate-x-1/2 opacity-60 transition-colors duration-500"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}55, transparent 65%)` }}
            />
            <div className="relative mx-auto aspect-square w-full max-w-[460px] px-4 pt-14" data-cursor="Boop">
              <Character
                color={color}
                body={body}
                eyes={eyes}
                mouth={mouth}
                topper={topper}
                jumpRef={jumpScope}
                spinRef={spinScope}
                shadowRef={shadowScope}
                onBoop={jump}
              />
            </div>
            <div className="relative border-t border-line bg-ink/40 p-5 backdrop-blur sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim">Meet</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={name}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-display text-2xl font-black tracking-tight sm:text-3xl"
                    >
                      {name}
                    </motion.div>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={idea}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1.5 text-sm text-mist sm:text-base"
                    >
                      <span className="text-paper">Logline:</span> {idea}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <motion.button
                  type="button"
                  onClick={newIdea}
                  whileTap={{ rotate: 180, scale: 0.9 }}
                  aria-label="New idea"
                  data-cursor="Roll"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white/5 text-paper transition-colors hover:bg-white/10"
                >
                  <Dices className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-6 rounded-[32px] border border-line bg-ink-2/60 p-5 sm:p-7">
            <Group label="Color">
              <div className="flex flex-wrap gap-2.5">
                {COLORS.map((c) => (
                  <motion.button
                    key={c}
                    type="button"
                    onClick={() => cast(setColor)(c)}
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Color ${c}`}
                    aria-pressed={color === c}
                    className="relative h-10 w-10 rounded-full"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${shade(c, 0.5)}, ${c} 55%, ${shade(c, -0.3)})` }}
                  >
                    {color === c && (
                      <motion.span layoutId="lab-color" className="absolute -inset-1.5 rounded-full border-2 border-paper" transition={spring} />
                    )}
                  </motion.button>
                ))}
              </div>
            </Group>
            <Options label="Body" id="body" options={BODIES} value={body} onChange={cast(setBody)} />
            <Options label="Eyes" id="eyes" options={EYES} value={eyes} onChange={cast(setEyes)} />
            <Options label="Mouth" id="mouth" options={MOUTHS} value={mouth} onChange={cast(setMouth)} />
            <Options label="On top" id="topper" options={TOPPERS} value={topper} onChange={cast(setTopper)} />

            <div className="mt-auto grid grid-cols-3 gap-2.5 pt-2">
              <ChunkyButton onClick={() => jump()} color="#ffe14d">Jump</ChunkyButton>
              <ChunkyButton onClick={() => spin()} color="#4df3ff">Spin</ChunkyButton>
              <ChunkyButton onClick={shuffle} color="#ff5fd2">Shuffle</ChunkyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">{label}</div>
      {children}
    </div>
  );
}

function Options<T extends string>({
  label,
  id,
  options,
  value,
  onChange,
}: {
  label: string;
  id: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <Group label={label}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              value === o ? "border-transparent text-ink" : "border-line text-mist hover:border-white/25 hover:text-paper"
            }`}
          >
            {value === o && (
              <motion.span layoutId={`lab-${id}`} className="absolute inset-0 rounded-full bg-paper" transition={spring} />
            )}
            <span className="relative">{o}</span>
          </button>
        ))}
      </div>
    </Group>
  );
}

function ChunkyButton({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl py-3.5 font-display text-sm font-black uppercase tracking-tight text-ink transition-[transform,box-shadow] duration-100 active:translate-y-[5px] sm:text-base"
      style={{ background: color, boxShadow: `0 5px 0 ${shade(color, -0.45)}` }}
      onMouseDown={(e) => (e.currentTarget.style.boxShadow = `0 0 0 ${shade(color, -0.45)}`)}
      onMouseUp={(e) => (e.currentTarget.style.boxShadow = `0 5px 0 ${shade(color, -0.45)}`)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 5px 0 ${shade(color, -0.45)}`)}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// The character itself
// ---------------------------------------------------------------------------

type CharacterProps = {
  color: string;
  body: Body;
  eyes: Eyes;
  mouth: Mouth;
  topper: Topper;
  jumpRef: React.RefObject<SVGGElement | null>;
  spinRef: React.RefObject<SVGGElement | null>;
  shadowRef: React.RefObject<SVGEllipseElement | null>;
  onBoop: () => void;
};

function Character({ color, body, eyes, mouth, topper, jumpRef, spinRef, shadowRef, onBoop }: CharacterProps) {
  const svg = useRef<SVGSVGElement>(null);
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const px = useSpring(lookX, { stiffness: 220, damping: 20 });
  const py = useSpring(lookY, { stiffness: 220, damping: 20 });
  const [blink, setBlink] = useState(false);

  // Pupils follow the pointer anywhere on the page.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = svg.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.45);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 300);
      lookX.set((dx / d) * 8 * reach);
      lookY.set((dy / d) * 7 * reach);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [lookX, lookY]);

  useEffect(() => {
    let timeout = 0;
    const loop = () => {
      timeout = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 130);
        loop();
      }, 2200 + Math.random() * 2800);
    };
    loop();
    return () => clearTimeout(timeout);
  }, []);

  const s = SHAPES[body];
  const top = s.cy - s.ry;
  const eyeY = s.cy - s.ry * 0.16;
  const eyeGap = s.rx * 0.38;
  const mouthY = s.cy + s.ry * 0.3;
  const light = shade(color, 0.55);
  const dark = shade(color, -0.35);

  return (
    <svg ref={svg} viewBox="0 0 300 320" className="h-full w-full overflow-visible" onClick={onBoop} role="img" aria-label="Your character">
      <defs>
        <radialGradient id="lab-body" cx="36%" cy="28%" r="78%">
          <motion.stop offset="0%" animate={{ stopColor: light }} />
          <motion.stop offset="50%" animate={{ stopColor: color }} />
          <motion.stop offset="100%" animate={{ stopColor: dark }} />
        </radialGradient>
        <filter id="lab-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse ref={shadowRef} cx="150" cy="298" rx="92" ry="12" fill="#000" opacity="0.35" style={{ transformBox: "fill-box", transformOrigin: "center" }} />

      <g ref={spinRef} style={{ transformBox: "fill-box", transformOrigin: "50% 60%" }}>
        <g ref={jumpRef} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
          <motion.g
            animate={{ scaleY: [1, 1.025, 1], scaleX: [1, 0.985, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          >
            {/* Feet and arms */}
            <motion.ellipse animate={{ fill: dark }} cx="112" cy="284" rx="27" ry="13" />
            <motion.ellipse animate={{ fill: dark }} cx="188" cy="284" rx="27" ry="13" />
            <motion.g animate={{ x: s.cx - s.rx + 4, y: s.cy + 14 }} transition={spring}>
              <motion.ellipse
                animate={{ fill: dark, rotate: [18, 30, 18] }}
                transition={{ rotate: { duration: 1.8, repeat: Infinity }, fill: { duration: 0.3 } }}
                rx="14"
                ry="27"
                style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
              />
            </motion.g>
            <motion.g animate={{ x: s.cx + s.rx - 4, y: s.cy + 14 }} transition={spring}>
              <motion.ellipse
                animate={{ fill: dark, rotate: [-18, -30, -18] }}
                transition={{ rotate: { duration: 1.8, repeat: Infinity, delay: 0.3 }, fill: { duration: 0.3 } }}
                rx="14"
                ry="27"
                style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
              />
            </motion.g>

            {/* Topper sits behind the body edge */}
            <motion.g animate={{ x: 150, y: top + 6 }} transition={spring}>
              <AnimatePresence>
                <motion.g
                  key={topper}
                  initial={{ y: -40, scale: 0, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: -30, scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <TopperArt topper={topper} dark={dark} />
                </motion.g>
              </AnimatePresence>
            </motion.g>

            {/* Body */}
            <motion.path d={bodyPath("Round")} animate={{ d: bodyPath(body) }} transition={spring} fill="url(#lab-body)" />
            <motion.ellipse
              animate={{ cx: s.cx - s.rx * 0.42, cy: s.cy - s.ry * 0.58, rx: s.rx * 0.28, ry: s.ry * 0.14 }}
              transition={spring}
              fill="#fff"
              opacity="0.4"
              style={{ rotate: -28 }}
            />

            {/* Face */}
            <motion.g animate={{ x: 150, y: eyeY }} transition={spring}>
              <motion.g
                animate={{ scaleY: blink ? 0.08 : 1 }}
                transition={{ duration: 0.07 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <AnimatePresence>
                  <motion.g
                    key={eyes + body}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 16 }}
                  >
                    <EyeArt kind={eyes} gap={eyeGap} px={px} py={py} lid={dark} />
                  </motion.g>
                </AnimatePresence>
              </motion.g>
            </motion.g>

            <motion.g animate={{ x: 150, y: mouthY }} transition={spring}>
              <motion.ellipse animate={{ cx: -s.rx * 0.56 }} cy="-4" rx="14" ry="8" fill="#ff3d8f" opacity="0.45" transition={spring} />
              <motion.ellipse animate={{ cx: s.rx * 0.56 }} cy="-4" rx="14" ry="8" fill="#ff3d8f" opacity="0.45" transition={spring} />
              <AnimatePresence>
                <motion.g
                  key={mouth}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.2, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 16 }}
                >
                  <MouthArt kind={mouth} />
                </motion.g>
              </AnimatePresence>
            </motion.g>
          </motion.g>
        </g>
      </g>
    </svg>
  );
}

type MV = ReturnType<typeof useSpring>;

function Eyeball({ x, r, px, py, kind, lid }: { x: number; r: number; px: MV; py: MV; kind: Eyes; lid: string }) {
  const iris = r * 0.58;
  return (
    <g transform={`translate(${x} 0)`}>
      <circle r={r} fill="#fff" />
      <motion.g style={{ x: px, y: kind === "Sleepy" ? 4 : py }}>
        {kind === "Star" ? (
          <path
            d={starPath(iris)}
            fill="#2a1468"
            className="a-spin svg-anim"
          />
        ) : (
          <>
            <circle r={iris} fill="#3a2a8c" />
            <circle r={iris * 0.55} fill="#07030f" />
          </>
        )}
        <circle cx={-iris * 0.35} cy={-iris * 0.4} r={r * 0.17} fill="#fff" />
        <circle cx={iris * 0.4} cy={iris * 0.35} r={r * 0.07} fill="#fff" />
      </motion.g>
      {kind === "Sleepy" && (
        <>
          <path d={`M${-r - 1} 2A${r + 1} ${r + 1} 0 0 1 ${r + 1} 2Z`} fill={lid} />
          <path d={`M${-r} 2H${r}`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

function starPath(r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(Math.cos(a) * rr).toFixed(2)} ${(Math.sin(a) * rr).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

function EyeArt({ kind, gap, px, py, lid }: { kind: Eyes; gap: number; px: MV; py: MV; lid: string }) {
  if (kind === "Cyclops") return <Eyeball x={0} r={40} px={px} py={py} kind={kind} lid={lid} />;
  const r = kind === "Sleepy" ? 24 : 27;
  return (
    <>
      <Eyeball x={-gap} r={r} px={px} py={py} kind={kind} lid={lid} />
      <Eyeball x={gap} r={r} px={px} py={py} kind={kind} lid={lid} />
    </>
  );
}

function MouthArt({ kind }: { kind: Mouth }) {
  switch (kind) {
    case "Grin":
      return (
        <>
          <path d="M-27 -4Q0 32 27 -4Z" fill={INK} />
          <path d="M-13 12Q0 22 13 12Q0 5 -13 12Z" fill="#ff6b8b" />
        </>
      );
    case "Gasp":
      return (
        <>
          <ellipse rx="13" ry="17" cy="4" fill={INK} />
          <ellipse rx="7" ry="5" cy="13" fill="#ff6b8b" />
        </>
      );
    case "Smirk":
      return <path d="M-18 4Q4 14 22 -6" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />;
    case "Blep":
      return (
        <>
          <path d="M3 2q0 18 10 18q10 0 10 -18Z" fill="#ff6b8b" />
          <path d="M-22 0Q0 10 24 0" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      );
  }
}

function TopperArt({ topper, dark }: { topper: Topper; dark: string }) {
  switch (topper) {
    case "None":
      return null;
    case "Antenna":
      return (
        <g className="a-sway origin-base">
          <path d="M0 4V-40" stroke={dark} strokeWidth="5" strokeLinecap="round" />
          <circle cy="-48" r="11" fill="#ffe14d" filter="url(#lab-glow)" />
          <circle cx="-3" cy="-51" r="3.5" fill="#fff" opacity="0.8" />
        </g>
      );
    case "Party":
      return (
        <g transform="rotate(-12)">
          <polygon points="-28,6 28,6 0,-66" fill="#ff5fd2" />
          <polygon points="-19,-16 19,-16 13,-34 -13,-34" fill="#ffe14d" />
          <polygon points="-7,-50 7,-50 0,-66" fill="#4df3ff" />
          <circle cy="-68" r="9" fill="#fff" />
        </g>
      );
    case "Sprout":
      return (
        <g className="a-sway-slow origin-base">
          <path d="M0 6Q-4 -18 2 -36" stroke="#2fae6b" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M2 -36q-26 -16 -36 4q22 12 36 -4Z" fill="#59d48a" />
          <path d="M2 -36q22 -22 36 -4q-18 16 -36 4Z" fill="#8af0ae" />
        </g>
      );
  }
}
