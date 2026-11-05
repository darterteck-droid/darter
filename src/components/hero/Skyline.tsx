// A neon future city on the horizon. Built from a fixed seed so the server
// and the browser draw the exact same skyline.

const W = 1440;
const H = 260;
const NEON = ["#ff5fd2", "#4df3ff", "#8b6cff", "#ffe14d"];
const WINDOW_COLORS = ["#ffe14d", "#4df3ff", "#ff9be3"];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type Tower = {
  x: number;
  w: number;
  h: number;
  tiers: number;
  neon: string | null;
  antenna: boolean;
  windows: { x: number; y: number; color: string; opacity: number; twinkle: boolean }[];
};

function build(seed: number, minH: number, maxH: number, withWindows: boolean): Tower[] {
  const rand = seeded(seed);
  const towers: Tower[] = [];
  let x = -20;
  while (x < W + 20) {
    const w = Math.round(30 + rand() * 64);
    // Taller toward the middle, like a downtown.
    const center = 1 - Math.abs(x + w / 2 - W / 2) / (W / 2);
    const h = Math.round(minH + Math.pow(rand(), 1.4) * (maxH - minH) * (0.55 + center * 0.45));
    const tiers = rand() > 0.82 ? 2 + Math.round(rand()) : 0;
    const neon = rand() > 0.72 ? NEON[Math.floor(rand() * NEON.length)] : null;
    const antenna = h > maxH * 0.62 && rand() > 0.4;
    const windows: Tower["windows"] = [];
    if (withWindows) {
      for (let wy = H - h + 12; wy < H - 6; wy += 14) {
        for (let wx = x + 6; wx < x + w - 8; wx += 10) {
          if (rand() > 0.8) {
            windows.push({
              x: wx,
              y: wy,
              color: WINDOW_COLORS[Math.floor(rand() * WINDOW_COLORS.length)],
              opacity: Math.round((0.45 + rand() * 0.5) * 100) / 100,
              twinkle: rand() > 0.9,
            });
          }
        }
      }
    }
    towers.push({ x, w, h, tiers, neon, antenna, windows });
    x += w + Math.round(2 + rand() * 8);
  }
  return towers;
}

const BACK = build(11, 60, 200, false);
const FRONT = build(29, 40, 170, true);

function Roof({ t, fill }: { t: Tower; fill: string }) {
  // Stacked pagoda-style roofs on a few towers.
  const top = H - t.h;
  return (
    <>
      {Array.from({ length: t.tiers }, (_, i) => {
        const inset = (i + 1) * (t.w * 0.14);
        const y = top - (i + 1) * 16;
        return (
          <g key={i}>
            <polygon
              points={`${t.x - 6 + inset * 0.6},${y + 16} ${t.x + t.w + 6 - inset * 0.6},${y + 16} ${t.x + t.w - inset},${y + 6} ${t.x + inset},${y + 6}`}
              fill={fill}
            />
            <rect x={t.x + inset + 4} y={y} width={Math.max(4, t.w - inset * 2 - 8)} height={7} fill={fill} />
            {t.neon && (
              <line
                x1={t.x - 6 + inset * 0.6}
                y1={y + 16}
                x2={t.x + t.w + 6 - inset * 0.6}
                y2={y + 16}
                stroke={t.neon}
                strokeWidth="1.5"
                opacity="0.9"
              />
            )}
          </g>
        );
      })}
    </>
  );
}

export default function Skyline() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      aria-hidden="true"
      style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}
    >
      <defs>
        <linearGradient id="sky-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d1538" />
          <stop offset="100%" stopColor="#0b0918" />
        </linearGradient>
        <linearGradient id="sky-horizon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4df3ff" stopOpacity="0" />
          <stop offset="30%" stopColor="#4df3ff" />
          <stop offset="70%" stopColor="#ff5fd2" />
          <stop offset="100%" stopColor="#ff5fd2" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g opacity="0.55">
        {BACK.map((t, i) => (
          <g key={i}>
            <rect x={t.x} y={H - t.h - 24} width={t.w} height={t.h + 24} fill="#2a1f55" />
            <Roof t={{ ...t, h: t.h + 24, neon: null }} fill="#2a1f55" />
          </g>
        ))}
      </g>

      {FRONT.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={H - t.h} width={t.w} height={t.h} fill="url(#sky-front)" />
          <Roof t={t} fill="#181230" />
          {t.neon && !t.tiers && <line x1={t.x} y1={H - t.h} x2={t.x + t.w} y2={H - t.h} stroke={t.neon} strokeWidth="2" />}
          {t.neon && <line x1={t.x + 0.75} y1={H - t.h} x2={t.x + 0.75} y2={H} stroke={t.neon} strokeWidth="1" opacity="0.5" />}
          {t.windows.map((w, j) => (
            <rect
              key={j}
              x={w.x}
              y={w.y}
              width="4"
              height="6"
              fill={w.color}
              opacity={w.opacity}
              className={w.twinkle ? "twinkle svg-anim" : undefined}
              style={w.twinkle ? ({ "--dur": "3.5s", "--delay": `${(j % 7) * 0.5}s` } as React.CSSProperties) : undefined}
            />
          ))}
          {t.antenna && (
            <>
              <line x1={t.x + t.w / 2} y1={H - t.h} x2={t.x + t.w / 2} y2={H - t.h - 26} stroke="#3a2f66" strokeWidth="2" />
              <circle cx={t.x + t.w / 2} cy={H - t.h - 28} r="2.5" fill="#ff3b5c" className="a-flash" />
            </>
          )}
        </g>
      ))}

      <rect x="0" y={H - 2} width={W} height="2" fill="url(#sky-horizon)" />
    </svg>
  );
}
