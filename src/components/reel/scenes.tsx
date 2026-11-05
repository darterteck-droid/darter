// Six tiny animated worlds, drawn in SVG, used as stand-ins on the reel cards
// until real episodes are dropped in. Loops come from the .a-* classes in
// globals.css, plus a little inline SMIL for timed sequences (the chop, the build).
// Rule of thumb: an element with a CSS animation never also carries a transform
// attribute (CSS would override it), so positioning lives on a parent <g>.

import type { SceneKey } from "@/lib/content";

const INK = "#1a0b24";

type SvgProps = { children: React.ReactNode };

function Frame({ children }: SvgProps) {
  return (
    <svg
      viewBox="0 0 270 480"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Sparkle({ x, y, s = 1, delay = "0s", color = "#fff" }: { x: number; y: number; s?: number; delay?: string; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 -8L2 -2L8 0L2 2L0 8L-2 2L-8 0L-2 -2Z"
        fill={color}
        className="twinkle svg-anim"
        style={{ "--delay": delay, "--dur": "2.4s" } as React.CSSProperties}
      />
    </g>
  );
}

function Eye({ x, y, r = 6, dx = 1, dy = 0 }: { x: number; y: number; r?: number; dx?: number; dy?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#fff" />
      <circle cx={dx} cy={dy} r={r * 0.56} fill={INK} />
      <circle cx={dx + r * 0.22} cy={dy - r * 0.24} r={r * 0.2} fill="#fff" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// 01 Last to First: a scrappy go-kart underdog chasing the trophy.
// ---------------------------------------------------------------------------

const CROWD = Array.from({ length: 42 }, (_, i) => {
  const row = Math.floor(i / 21);
  return {
    x: 4 + (i % 21) * 12.8 + row * 6,
    y: 242 + row * 12,
    c: ["#ffe14d", "#ff5fd2", "#4df3ff", "#ffffff"][i % 4],
  };
});

function RaceScene() {
  return (
    <Frame>
      <defs>
        <linearGradient id="race-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0a2a" />
          <stop offset="48%" stopColor="#3b1670" />
          <stop offset="100%" stopColor="#ff5f6d" />
        </linearGradient>
        <linearGradient id="race-kart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#d61f4b" />
        </linearGradient>
        <radialGradient id="race-racer" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#efffc6" />
          <stop offset="55%" stopColor="#b6ff5c" />
          <stop offset="100%" stopColor="#5fbf2a" />
        </radialGradient>
        <linearGradient id="race-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3a8" />
          <stop offset="60%" stopColor="#ffd23f" />
          <stop offset="100%" stopColor="#d99a00" />
        </linearGradient>
        <pattern id="race-check" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#fff" />
          <rect width="4" height="4" fill="#15101f" />
          <rect x="4" y="4" width="4" height="4" fill="#15101f" />
        </pattern>
      </defs>
      <rect width="270" height="480" fill="url(#race-sky)" />
      <Sparkle x={52} y={40} s={0.6} delay="0.3s" />
      <Sparkle x={214} y={28} s={0.5} delay="1.1s" />

      {/* Stadium lights */}
      <g className="a-beam origin-top" style={{ animationDuration: "4s" }}>
        <polygon points="24,72 -50,300 80,300" fill="#fff6d0" opacity="0.1" />
      </g>
      <g className="a-beam origin-top" style={{ animationDuration: "4s", animationDelay: "-2s" }}>
        <polygon points="246,72 190,300 320,300" fill="#fff6d0" opacity="0.1" />
      </g>
      <rect x="21" y="70" width="6" height="160" fill="#241a4a" />
      <rect x="243" y="70" width="6" height="160" fill="#241a4a" />
      <rect x="8" y="58" width="32" height="14" rx="4" fill="#fff6d0" />
      <rect x="230" y="58" width="32" height="14" rx="4" fill="#fff6d0" />

      {/* Grandstand */}
      <rect y="232" width="270" height="42" fill="#1a1238" />
      {CROWD.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r="2.2"
          fill={d.c}
          className="twinkle svg-anim"
          style={{ "--delay": `${((i * 0.23) % 2).toFixed(2)}s`, "--dur": "1.6s" } as React.CSSProperties}
        />
      ))}

      {/* Trophy waiting past the finish line */}
      <circle cx="135" cy="172" r="26" fill="#ffe14d" opacity="0.3" className="twinkle svg-anim" style={{ "--dur": "2s" } as React.CSSProperties} />
      <g transform="translate(135 176)">
        <path d="M-13 -20H13Q13 -2 0 2Q-13 -2 -13 -20Z" fill="url(#race-gold)" />
        <path d="M-13 -16Q-22 -16 -20 -8Q-18 -2 -10 -4M13 -16Q22 -16 20 -8Q18 -2 10 -4" stroke="#ffd23f" strokeWidth="3" fill="none" />
        <rect x="-3" y="2" width="6" height="8" fill="#d99a00" />
        <rect x="-10" y="10" width="20" height="5" rx="2" fill="#ffd23f" />
        <path d="M-7 -16Q-7 -6 -2 -3" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" fill="none" />
      </g>
      <Sparkle x={152} y={160} s={0.55} delay="0.5s" />
      <rect x="99" y="198" width="4" height="76" fill="#d8d4ff" />
      <rect x="167" y="198" width="4" height="76" fill="#d8d4ff" />
      <rect x="97" y="196" width="76" height="14" fill="url(#race-check)" />

      {/* Track rushing toward you */}
      <polygon points="0,272 112,272 0,416" fill="#1f7a43" />
      <polygon points="158,272 270,272 270,416" fill="#1f7a43" />
      <polygon points="112,272 158,272 320,480 -50,480" fill="#2a2340" />
      <line x1="112" y1="272" x2="-50" y2="480" stroke="#fff" strokeWidth="7" />
      <line x1="112" y1="272" x2="-50" y2="480" stroke="#ff3d5a" strokeWidth="7" strokeDasharray="12 12">
        <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.3s" repeatCount="indefinite" />
      </line>
      <line x1="158" y1="272" x2="320" y2="480" stroke="#fff" strokeWidth="7" />
      <line x1="158" y1="272" x2="320" y2="480" stroke="#ff3d5a" strokeWidth="7" strokeDasharray="12 12">
        <animate attributeName="stroke-dashoffset" values="0;-24" dur="0.3s" repeatCount="indefinite" />
      </line>
      <line x1="135" y1="274" x2="135" y2="480" stroke="#fff" strokeWidth="4" strokeDasharray="14 20" opacity="0.8">
        <animate attributeName="stroke-dashoffset" values="0;-34" dur="0.3s" repeatCount="indefinite" />
      </line>

      {/* Speed streaks */}
      {[292, 318, 344, 380, 412, 446].map((y, i) => (
        <g key={y} className="a-drift" style={{ animationDuration: `${0.7 + (i % 3) * 0.2}s`, animationDelay: `${-i * 0.17}s` }}>
          <line x1="0" y1={y} x2={40 + (i % 2) * 30} y2={y} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        </g>
      ))}

      {/* The underdog */}
      <g transform="translate(135 376) scale(1.2)">
        <g className="a-crawl" style={{ animationDuration: "2.4s" }}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -1.5;0 1;0 0" dur="0.22s" repeatCount="indefinite" />
            <ellipse cx="0" cy="3" rx="66" ry="8" fill="#000" opacity="0.35" />
            <rect x="-70" y="-40" width="22" height="36" rx="8" fill="#15101f" />
            <rect x="48" y="-40" width="22" height="36" rx="8" fill="#15101f" />
            {[-58, 58].map((x) => (
              <g key={x} transform={`translate(${x} 0)`}>
                <circle r="7" fill="#fff" opacity="0.5" className="a-steam" style={{ animationDuration: "0.7s", animationDelay: x < 0 ? "0s" : "-0.35s" }} />
              </g>
            ))}
            <path d="M16 -62Q36 -60 52 -72Q44 -58 20 -54Z" fill="#ff5fd2" className="a-sway origin-bl" style={{ animationDuration: "0.5s" }} />
            <ellipse cx="0" cy="-70" rx="24" ry="22" fill="url(#race-racer)" />
            <ellipse cx="-9" cy="-85" rx="7" ry="4" fill="#fff" opacity="0.45" />
            <rect x="-24" y="-81" width="48" height="6" fill="#3b2a6a" />
            <circle cx="-10" cy="-78" r="9" fill="#c9f6ff" stroke="#3b2a6a" strokeWidth="3" />
            <circle cx="10" cy="-78" r="9" fill="#c9f6ff" stroke="#3b2a6a" strokeWidth="3" />
            <circle cx="-9" cy="-77" r="4" fill={INK} />
            <circle cx="11" cy="-77" r="4" fill={INK} />
            <circle cx="-7.5" cy="-78.5" r="1.4" fill="#fff" />
            <circle cx="12.5" cy="-78.5" r="1.4" fill="#fff" />
            <path d="M-9 -64Q0 -58 9 -64" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M-56 -16L-44 -52H44L56 -16Q58 -6 48 -4H-48Q-58 -6 -56 -16Z" fill="url(#race-kart)" />
            <path d="M-40 -48H40" stroke="#fff" strokeWidth="2" opacity="0.4" />
            <ellipse cx="0" cy="-54" rx="16" ry="5" stroke="#2a1a3a" strokeWidth="4" fill="none" />
            <circle cx="-14" cy="-54" r="5" fill="#b6ff5c" />
            <circle cx="14" cy="-54" r="5" fill="#b6ff5c" />
            <rect x="-15" y="-36" width="30" height="18" rx="4" fill="#fff" />
            <text x="0" y="-22" textAnchor="middle" fontSize="14" fontWeight="900" fill="#ff3d5a" fontFamily="var(--font-unbounded)">
              7
            </text>
            <rect x="-60" y="-26" width="22" height="30" rx="8" fill="#1d1530" />
            <rect x="38" y="-26" width="22" height="30" rx="8" fill="#1d1530" />
            <rect x="-54" y="-16" width="10" height="10" rx="3" fill="#9aa3c7" />
            <rect x="44" y="-16" width="10" height="10" rx="3" fill="#9aa3c7" />
            <circle cx="-34" cy="-30" r="5" fill="#fff7c2" />
            <circle cx="34" cy="-30" r="5" fill="#fff7c2" />
          </g>
        </g>
      </g>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// 02 Penny to Penthouse: a raccoon in a too-big suit, a tower on the rise.
// ---------------------------------------------------------------------------

const HUSTLE_BLOCKS = [
  { x: 0, w: 38, top: 250 },
  { x: 34, w: 30, top: 214 },
  { x: 60, w: 42, top: 268 },
  { x: 98, w: 30, top: 228 },
  { x: 204, w: 32, top: 236 },
  { x: 230, w: 42, top: 196 },
];

const BILLS = [
  { x: 28, d: 5.2, b: 0.4 },
  { x: 74, d: 6.4, b: 3.1 },
  { x: 118, d: 4.6, b: 1.8 },
  { x: 160, d: 5.8, b: 4.4 },
  { x: 206, d: 4.9, b: 2.5 },
  { x: 246, d: 6.8, b: 0.9 },
];

const RISE = {
  keyTimes: "0;0.5;0.85;1",
  calcMode: "spline",
  keySplines: "0.4 0 0.2 1;0 0 1 1;0.5 0 0.5 1",
  dur: "7s",
  repeatCount: "indefinite",
} as const;

function HustleScene() {
  return (
    <Frame>
      <defs>
        <linearGradient id="hustle-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070b24" />
          <stop offset="60%" stopColor="#1b1450" />
          <stop offset="100%" stopColor="#3a1a6b" />
        </linearGradient>
        <linearGradient id="hustle-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5aa8ff" />
          <stop offset="55%" stopColor="#6b4cff" />
          <stop offset="100%" stopColor="#2b1a6b" />
        </linearGradient>
        <pattern id="hustle-win" width="10" height="12" patternUnits="userSpaceOnUse">
          <rect x="2" y="3" width="6" height="6" rx="1" fill="#d6f0ff" opacity="0.55" />
        </pattern>
        <radialGradient id="hustle-fur" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#e4e1ee" />
          <stop offset="55%" stopColor="#a39eb6" />
          <stop offset="100%" stopColor="#6e6884" />
        </radialGradient>
        <linearGradient id="hustle-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4b36b0" />
          <stop offset="100%" stopColor="#22186a" />
        </linearGradient>
      </defs>
      <rect width="270" height="480" fill="url(#hustle-sky)" />
      {[[30, 30], [120, 44], [200, 22], [250, 110], [60, 120]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#fff" className="twinkle svg-anim" style={{ "--delay": `${i * 0.5}s` } as React.CSSProperties} />
      ))}

      {/* Up-only ticker */}
      <rect y="64" width="270" height="20" fill="#0b0820" opacity="0.85" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;-260 0" dur="6s" repeatCount="indefinite" />
        {[0, 260, 520].map((x) => (
          <text key={x} x={x} y="78" textLength="250" lengthAdjust="spacing" fontSize="10" fontWeight="700" fill="#3ddc84" fontFamily="var(--font-jetbrains)">
            ▲ HUSTLE ▲ GRIND ▲ COME UP ▲ STACK IT
          </text>
        ))}
      </g>

      {/* Skyline */}
      {HUSTLE_BLOCKS.map((b, bi) => (
        <g key={bi}>
          <rect x={b.x} y={b.top} width={b.w} height={480 - b.top} fill="#161036" />
          {Array.from({ length: Math.floor((400 - b.top) / 12) }, (_, r) =>
            Array.from({ length: Math.floor((b.w - 6) / 8) }, (_, c) =>
              (r * 7 + c * 3 + bi) % 4 === 0 ? null : (
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 5 + c * 8}
                  y={b.top + 8 + r * 12}
                  width="4"
                  height="6"
                  fill="#ffd36e"
                  opacity={0.3 + ((r + c + bi) % 3) * 0.22}
                />
              ),
            ),
          )}
        </g>
      ))}

      {/* The tower that keeps going up */}
      <rect x="140" y="300" width="58" height="180" fill="url(#hustle-glass)">
        <animate attributeName="y" values="300;118;118;300" {...RISE} />
        <animate attributeName="height" values="180;362;362;180" {...RISE} />
      </rect>
      <rect x="140" y="300" width="58" height="180" fill="url(#hustle-win)">
        <animate attributeName="y" values="300;118;118;300" {...RISE} />
        <animate attributeName="height" values="180;362;362;180" {...RISE} />
      </rect>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -182;0 -182;0 0" {...RISE} />
        <rect x="138" y="294" width="62" height="7" rx="2" fill="#ffd23f" />
        <path d="M169 294V274" stroke="#ffd23f" strokeWidth="2.5" />
        <circle cx="169" cy="271" r="4" fill="#ff5fd2" className="a-flash" />
      </g>
      <rect y="404" width="270" height="76" fill="#0e0a24" />
      <rect y="404" width="270" height="2" fill="#2b2160" />

      {/* Money in the air */}
      {BILLS.map((bill, i) => (
        <g key={i} transform={`translate(${bill.x} 0)`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 -30;0 520" dur={`${bill.d}s`} begin={`-${bill.b}s`} repeatCount="indefinite" />
            <g className="a-sway svg-anim" style={{ animationDuration: "1.4s", animationDelay: `${-i * 0.3}s` }}>
              <rect x="-12" y="-6" width="24" height="12" rx="2" fill="#3ddc84" stroke="#1f9d55" strokeWidth="1.5" />
              <circle r="3.2" fill="#a8f5c8" />
            </g>
          </g>
        </g>
      ))}

      {/* The hustler */}
      <g transform="translate(112 406)">
        <ellipse cx="0" cy="2" rx="52" ry="7" fill="#000" opacity="0.4" />
        <g transform="translate(30 -48)">
          <g className="a-sway-slow origin-bl">
            <path d="M0 0Q30 -6 40 -40" stroke="#8a8499" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M0 0Q30 -6 40 -40" stroke="#2a2433" strokeWidth="16" strokeLinecap="round" strokeDasharray="8 9" fill="none" />
          </g>
        </g>
        <rect x="-19" y="-42" width="14" height="40" rx="5" fill="#1b1450" />
        <rect x="5" y="-42" width="14" height="40" rx="5" fill="#1b1450" />
        <ellipse cx="-14" cy="-2" rx="13" ry="6" fill="#0b0712" />
        <ellipse cx="14" cy="-2" rx="13" ry="6" fill="#0b0712" />
        <ellipse cx="-18" cy="-5" rx="5" ry="1.6" fill="#fff" opacity="0.4" />
        <path d="M-34 -108L-46 -62" stroke="#2c207a" strokeWidth="15" strokeLinecap="round" />
        <rect x="-66" y="-64" width="36" height="26" rx="5" fill="#a0612f" />
        <path d="M-54 -64V-70H-42V-64" stroke="#6b3d18" strokeWidth="3" fill="none" />
        <rect x="-66" y="-54" width="36" height="3" fill="#ffd23f" />
        <circle cx="-46" cy="-62" r="7" fill="#8a8499" />
        <path d="M-44 -40L-36 -120Q0 -134 36 -120L44 -40Q0 -30 -44 -40Z" fill="url(#hustle-suit)" />
        <path d="M-13 -124L0 -88L13 -124Z" fill="#fff" />
        <path d="M-4 -112H4L6 -80L0 -72L-6 -80Z" fill="#ff5fd2" />
        <path d="M-13 -124L-4 -96L-20 -110ZM13 -124L4 -96L20 -110Z" fill="#3a2a8c" />
        <rect x="18" y="-104" width="12" height="5" rx="1.5" fill="#ffd23f" />
        <circle cx="0" cy="-60" r="2.5" fill="#ffd23f" />
        <circle cx="0" cy="-50" r="2.5" fill="#ffd23f" />
        <g transform="translate(32 -112)">
          <g className="a-wave origin-bl" style={{ animationDuration: "0.6s" }}>
            <path d="M0 0L22 -34" stroke="#3a2a8c" strokeWidth="15" strokeLinecap="round" />
            <g transform="translate(26 -44)">
              <rect x="-4" y="-16" width="22" height="11" rx="2" fill="#3ddc84" transform="rotate(-30)" />
              <rect x="-4" y="-16" width="22" height="11" rx="2" fill="#5ff0a0" transform="rotate(-5)" />
              <rect x="-4" y="-16" width="22" height="11" rx="2" fill="#3ddc84" transform="rotate(20)" />
              <circle r="8" fill="#8a8499" />
            </g>
          </g>
        </g>
        <g transform="translate(0 -152)">
          <ellipse cx="-22" cy="-24" rx="9" ry="11" fill="#8a8499" />
          <ellipse cx="22" cy="-24" rx="9" ry="11" fill="#8a8499" />
          <ellipse cx="-22" cy="-23" rx="5" ry="6" fill="#ff9fc8" />
          <ellipse cx="22" cy="-23" rx="5" ry="6" fill="#ff9fc8" />
          <circle r="30" fill="url(#hustle-fur)" />
          <path d="M-24 -20Q0 -44 28 -18Q8 -30 -24 -20Z" fill="#4a4458" />
          <path d="M-12 -28Q2 -36 16 -28" stroke="#fff" strokeWidth="2" opacity="0.45" fill="none" strokeLinecap="round" />
          <path d="M-28 -4Q-14 -18 0 -6Q14 -18 28 -4Q20 12 0 4Q-20 12 -28 -4Z" fill="#1d1626" />
          <Eye x={-11} y={-4} r={7} dx={1.5} dy={1} />
          <Eye x={11} y={-4} r={7} dx={1.5} dy={1} />
          <path d="M-18.5 -5Q-11 -14 -3.5 -5ZM3.5 -5Q11 -14 18.5 -5Z" fill="#1d1626" />
          <ellipse cx="0" cy="12" rx="13" ry="9" fill="#f1eef7" />
          <ellipse cx="0" cy="8" rx="4.5" ry="3.2" fill="#1d1626" />
          <path d="M-6 15Q2 20 9 13" stroke="#1d1626" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// 03 Night Patrol: a kid in a chunky mech suit over a neon city.
// ---------------------------------------------------------------------------

const PATROL_TOWERS = [
  { x: 96, w: 30, top: 336 },
  { x: 170, w: 36, top: 282 },
  { x: 214, w: 48, top: 318 },
];

const roof = (cx: number, y: number, half: number) =>
  `M${cx - half} ${y}Q${cx} ${y - 8} ${cx + half} ${y}L${cx + half - 7} ${y - 8}Q${cx} ${y - 16} ${cx - half + 7} ${y - 8}Z`;

function PatrolScene() {
  return (
    <Frame>
      <defs>
        <linearGradient id="patrol-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050a2e" />
          <stop offset="60%" stopColor="#11236a" />
          <stop offset="100%" stopColor="#3d1d7f" />
        </linearGradient>
        <radialGradient id="patrol-moon" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#fff6fb" />
          <stop offset="60%" stopColor="#ffc6e4" />
          <stop offset="100%" stopColor="#ff8fc8" />
        </radialGradient>
        <linearGradient id="patrol-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4df3ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3a3aa8" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="patrol-armor" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#d9ccff" />
          <stop offset="50%" stopColor="#8b6cff" />
          <stop offset="100%" stopColor="#4b2fb8" />
        </radialGradient>
        <linearGradient id="patrol-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8fbff" />
          <stop offset="100%" stopColor="#2b6cff" />
        </linearGradient>
        <pattern id="patrol-win" width="8" height="10" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="4" height="5" fill="#9ff7ff" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="270" height="480" fill="url(#patrol-sky)" />
      <circle cx="206" cy="96" r="72" fill="#ffc6e4" opacity="0.14" />
      <circle cx="206" cy="96" r="44" fill="url(#patrol-moon)" />
      <circle cx="192" cy="84" r="7" fill="#ff8fc8" opacity="0.25" />
      <circle cx="220" cy="110" r="5" fill="#ff8fc8" opacity="0.25" />
      {[[30, 40], [80, 22], [130, 60], [40, 150], [100, 120], [250, 170], [150, 180]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 1.4 : 2} fill="#fff" className="twinkle svg-anim" style={{ "--delay": `${i * 0.4}s` } as React.CSSProperties} />
      ))}
      {[150, 186, 214].map((y, i) => (
        <g key={y} className="a-drift" style={{ animationDuration: `${7 + i * 3}s`, animationDelay: `${-i * 2.5}s` }}>
          <circle cx="0" cy={y} r="2" fill={i % 2 ? "#ff5fd2" : "#4df3ff"} />
          <circle cx="-6" cy={y} r="1.4" fill="#fff" opacity="0.5" />
        </g>
      ))}

      {/* Searchlights */}
      <g className="a-beam origin-base" style={{ animationDuration: "5s" }}>
        <polygon points="70,480 30,180 110,180" fill="#4df3ff" opacity="0.1" />
      </g>
      <g className="a-beam origin-base" style={{ animationDuration: "4s", animationDelay: "-2s" }}>
        <polygon points="210,480 170,200 250,200" fill="#ff5fd2" opacity="0.1" />
      </g>

      {/* Far skyline */}
      <path d="M0 370L18 352L30 360L44 338L62 352L84 344L104 356L128 330L150 348L170 336L196 350L222 334L246 352L270 342V480H0Z" fill="#17145a" />

      {/* Pagoda tower */}
      <rect x="36" y="400" width="32" height="80" fill="#241b66" />
      <rect x="40" y="356" width="24" height="46" fill="#241b66" />
      <rect x="43" y="318" width="18" height="40" fill="#241b66" />
      <path d={roof(52, 402, 30)} fill="#2e2380" stroke="#ff5fd2" strokeWidth="1" strokeOpacity="0.7" />
      <path d={roof(52, 358, 24)} fill="#2e2380" stroke="#ff5fd2" strokeWidth="1" strokeOpacity="0.7" />
      <path d={roof(52, 320, 18)} fill="#2e2380" stroke="#ff5fd2" strokeWidth="1" strokeOpacity="0.7" />
      <path d="M52 296V312" stroke="#ff5fd2" strokeWidth="2" />
      <circle cx="52" cy="294" r="2.5" fill="#ff5fd2" className="a-flash" />
      {[[44, 330], [56, 330], [46, 370], [56, 370], [42, 414], [58, 414], [42, 440], [58, 440]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="5" height="7" fill="#ffd36e" opacity={0.5 + (i % 3) * 0.2} />
      ))}

      {/* Glass towers */}
      {PATROL_TOWERS.map((t) => (
        <g key={t.x}>
          <rect x={t.x} y={t.top} width={t.w} height={480 - t.top} fill="url(#patrol-glass)" />
          <rect x={t.x} y={t.top} width={t.w} height={480 - t.top} fill="url(#patrol-win)" />
          <rect x={t.x} y={t.top} width={t.w} height="3" fill="#4df3ff" />
        </g>
      ))}
      <rect x="176" y="300" width="22" height="8" rx="2" fill="#ff5fd2" className="a-flash" />
      <rect x="104" y="356" width="16" height="6" rx="2" fill="#4df3ff" className="a-flash" style={{ animationDelay: "-0.6s" }} />
      <rect y="438" width="270" height="42" fill="#0a0a26" />
      <path d="M20 438V420M24 420H16M232 438V424H246V438" stroke="#2a2870" strokeWidth="3" fill="none" />

      {/* The hero */}
      <g transform="translate(140 214) rotate(-16) scale(1.15)">
        <g className="a-bob" style={{ animationDuration: "2.4s" }}>
          <path d="M-30 40Q-80 90 -120 150" stroke="#fff" strokeWidth="10" opacity="0.08" fill="none" strokeLinecap="round" />
          <path d="M-10 44Q-50 100 -80 170" stroke="#4df3ff" strokeWidth="5" opacity="0.2" fill="none" strokeLinecap="round" />
          {[
            { x: -20, y: 58, d: "0.2s" },
            { x: 6, y: 60, d: "0.16s" },
          ].map((boot, i) => (
            <g key={i} transform={`translate(${boot.x} ${boot.y})`}>
              <g>
                <animateTransform attributeName="transform" type="scale" values="1 1;0.85 1.35;1.1 0.9;1 1" dur={boot.d} repeatCount="indefinite" />
                <path d="M-8 6Q0 40 8 6Z" fill="#ffb03a" />
                <path d="M-4 6Q0 26 4 6Z" fill="#fff3a8" />
              </g>
              <rect x="-12" y="-8" width="24" height="16" rx="6" fill="#3b2a8c" />
              <rect x="-12" y="-2" width="24" height="4" fill="#4df3ff" opacity="0.8" />
            </g>
          ))}
          <path d="M-10 18L-20 50M10 18L6 52" stroke="#8b6cff" strokeWidth="17" strokeLinecap="round" />
          <path d="M-26 -18L-38 8" stroke="#6a4ee0" strokeWidth="15" strokeLinecap="round" />
          <circle cx="-39" cy="12" r="9" fill="#b6ff5c" />
          <rect x="-26" y="-32" width="52" height="54" rx="18" fill="url(#patrol-armor)" />
          <path d="M-18 -24Q-8 -30 4 -26" stroke="#fff" strokeWidth="3" opacity="0.4" strokeLinecap="round" fill="none" />
          <circle cx="0" cy="-4" r="11" fill="#1a1050" />
          <circle cx="0" cy="-4" r="7" fill="#4df3ff" className="twinkle svg-anim" style={{ "--dur": "1.2s" } as React.CSSProperties} />
          <rect x="-26" y="10" width="52" height="7" fill="#3b2a8c" />
          <circle cx="-27" cy="-24" r="13" fill="#b6ff5c" />
          <circle cx="27" cy="-24" r="13" fill="#b6ff5c" />
          <path d="M27 -26L50 -58" stroke="#8b6cff" strokeWidth="16" strokeLinecap="round" />
          <circle cx="53" cy="-63" r="11" fill="#b6ff5c" />
          <g transform="translate(0 -58)">
            <path d="M-24 -6L-34 -22L-20 -15ZM24 -6L34 -22L20 -15Z" fill="#b6ff5c" />
            <circle r="25" fill="url(#patrol-armor)" />
            <rect x="-19" y="-12" width="38" height="22" rx="11" fill="url(#patrol-visor)" />
            <Eye x={-7} y={-1} r={5} dx={1.4} dy={-0.6} />
            <Eye x={8} y={-1} r={5} dx={1.4} dy={-0.6} />
            <path d="M-14 -8Q-6 -12 4 -10" stroke="#fff" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" fill="none" />
            <path d="M-6 16Q1 21 8 16" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        </g>
      </g>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// 04 Fresh Cut: one clean chop, two perfect halves, repeat forever.
// ---------------------------------------------------------------------------

const CUT_SEEDS: [number, number, number][] = [
  [-50, -8, -20],
  [-38, 18, 10],
  [-30, -30, -30],
  [-50, 22, 25],
  [-20, 2, 0],
  [-44, -24, -15],
  [-24, 30, 15],
  [-14, -18, -5],
];

const DROPS: [number, number][] = [
  [-60, -40],
  [-30, -70],
  [10, -78],
  [44, -60],
  [70, -30],
  [-82, -10],
  [82, -4],
];

const CUT = { dur: "3s", repeatCount: "indefinite" } as const;

function MelonHalf({ side }: { side: -1 | 1 }) {
  const d = side < 0 ? "M0 -66A80 66 0 0 0 0 66Z" : "M0 -66A80 66 0 0 1 0 66Z";
  return (
    <>
      <path d={d} fill="#2f9e4f" />
      <path d={d} fill="#eaffd2" transform="scale(0.9)" />
      <path d={d} fill="url(#cut-flesh)" transform="scale(0.82)" />
      {CUT_SEEDS.map(([x, y, r], i) => (
        <ellipse key={i} cx={side < 0 ? x : -x} cy={y} rx="2.2" ry="3.6" fill={INK} transform={`rotate(${side < 0 ? r : -r} ${side < 0 ? x : -x} ${y})`} />
      ))}
    </>
  );
}

function CutScene() {
  return (
    <Frame>
      <defs>
        <linearGradient id="cut-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff4ec" />
          <stop offset="60%" stopColor="#ffd9c7" />
          <stop offset="100%" stopColor="#ffb3b3" />
        </linearGradient>
        <radialGradient id="cut-rind" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#8be07a" />
          <stop offset="55%" stopColor="#3cb04f" />
          <stop offset="100%" stopColor="#1d6b34" />
        </radialGradient>
        <radialGradient id="cut-flesh" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ff9aa8" />
          <stop offset="55%" stopColor="#ff3b5c" />
          <stop offset="100%" stopColor="#d6143f" />
        </radialGradient>
        <linearGradient id="cut-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f4f6ff" />
          <stop offset="60%" stopColor="#c3c9de" />
          <stop offset="100%" stopColor="#8d95b4" />
        </linearGradient>
        <linearGradient id="cut-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0c48b" />
          <stop offset="100%" stopColor="#d49a58" />
        </linearGradient>
        <clipPath id="cut-clip">
          <ellipse rx="80" ry="66" />
        </clipPath>
      </defs>
      <rect width="270" height="480" fill="url(#cut-bg)" />
      {[[40, 90, 26], [220, 60, 18], [235, 190, 30], [30, 230, 14], [150, 40, 10]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity="0.35" />
      ))}
      <Sparkle x={60} y={180} s={0.7} delay="0s" color="#ff7a8f" />
      <Sparkle x={214} y={150} s={0.6} delay="0.9s" color="#ff7a8f" />
      <Sparkle x={196} y={226} s={0.45} delay="1.6s" />

      {/* Board */}
      <ellipse cx="135" cy="374" rx="118" ry="12" fill="#000" opacity="0.15" />
      <rect x="22" y="346" width="226" height="26" rx="12" fill="#b9773d" />
      <rect x="22" y="338" width="226" height="18" rx="9" fill="url(#cut-wood)" />
      <path d="M44 345H120M150 348H220M70 351H190" stroke="#b97a3c" strokeWidth="1.5" opacity="0.5" />

      <g transform="translate(135 280)">
        {/* Whole melon, pops back in after every cut */}
        <g>
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.27;0.28;0.86;1" {...CUT} />
          <animateTransform attributeName="transform" type="scale" values="1;1;0.5;1.08;1" keyTimes="0;0.86;0.87;0.95;1" {...CUT} />
          <ellipse rx="80" ry="66" fill="url(#cut-rind)" />
          <g clipPath="url(#cut-clip)">
            {[-56, -28, 0, 28, 56].map((x) => (
              <path key={x} d={`M${x} -70Q${x - 12} 0 ${x} 70`} stroke="#1d6b34" strokeWidth="9" fill="none" opacity="0.7" />
            ))}
          </g>
          <ellipse cx="-30" cy="-36" rx="22" ry="10" fill="#fff" opacity="0.35" transform="rotate(-20 -30 -36)" />
        </g>

        {/* The two halves falling open */}
        <g>
          <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.27;0.28;0.78;0.85;1" {...CUT} />
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 -6 64;0 -6 64;-26 -6 64;-26 -6 64"
              keyTimes="0;0.28;0.4;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.2 0.8 0.3 1;0 0 1 1"
              {...CUT}
            />
            <MelonHalf side={-1} />
          </g>
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 6 64;0 6 64;26 6 64;26 6 64"
              keyTimes="0;0.28;0.4;1"
              calcMode="spline"
              keySplines="0 0 1 1;0.2 0.8 0.3 1;0 0 1 1"
              {...CUT}
            />
            <MelonHalf side={1} />
          </g>
        </g>

        {/* Juice */}
        {DROPS.map(([dx, dy], i) => (
          <circle key={i} r={3 + (i % 3)} fill="#ff3b5c">
            <animateTransform attributeName="transform" type="translate" values={`0 0;0 0;${dx} ${dy};${dx} ${dy + 30}`} keyTimes="0;0.28;0.42;1" {...CUT} />
            <animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;0.28;0.3;0.55;1" {...CUT} />
          </circle>
        ))}
      </g>

      {/* The knife */}
      <g transform="translate(128 0)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 196;0 352;0 352;0 196;0 196"
            keyTimes="0;0.26;0.34;0.62;1"
            calcMode="spline"
            keySplines="0.7 0 0.9 0.6;0 0 1 1;0.3 0 0.3 1;0 0 1 1"
            {...CUT}
          />
          <rect x="-3" y="-160" width="16" height="52" rx="6" fill="#3a2416" />
          <circle cx="5" cy="-146" r="2" fill="#d9c7b0" />
          <circle cx="5" cy="-124" r="2" fill="#d9c7b0" />
          <path d="M-12 -110H24Q26 -40 20 0H-14Q-12 -55 -12 -110Z" fill="url(#cut-steel)" />
          <path d="M-14 -2H20" stroke="#fff" strokeWidth="2" opacity="0.8" />
          <circle cx="14" cy="-96" r="4" fill="#ffe6da" />
          <path d="M-6 -104Q-8 -60 -6 -20" stroke="#fff" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// 05 The Hut: two builders, one clearing, a hut from nothing. Time-lapse.
// ---------------------------------------------------------------------------

const BUILD = { dur: "8s", repeatCount: "indefinite" } as const;
const LOG_START = [0.06, 0.15, 0.24, 0.33, 0.42];

function Palm({ x, y, flip = false, delay = "0s" }: { x: number; y: number; flip?: boolean; delay?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d="M0 0Q-6 -60 10 -120" stroke="#8a5a2b" strokeWidth="9" fill="none" strokeLinecap="round" />
      <g transform="translate(10 -120)">
        <g className="a-sway-slow svg-anim" style={{ animationDelay: delay }}>
          {[-170, -130, -90, -50, -10, 30].map((a, i) => (
            <path key={a} d="M0 0Q30 -14 62 6Q30 -2 0 0Z" fill={i % 2 ? "#2fae6b" : "#45c97c"} transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
    </g>
  );
}

function Builder({ shirt, children }: { shirt: string; children?: React.ReactNode }) {
  return (
    <>
      <ellipse cx="0" cy="1" rx="18" ry="4" fill="#000" opacity="0.22" />
      <rect x="-9" y="-18" width="7" height="18" rx="3" fill="#5a3d24" />
      <rect x="2" y="-18" width="7" height="18" rx="3" fill="#5a3d24" />
      <rect x="-13" y="-44" width="26" height="28" rx="10" fill={shirt} />
      {children}
      <circle cy="-56" r="14" fill="url(#hut-skin)" />
      <path d="M-13 -60Q-10 -74 2 -72Q12 -72 13 -60Q6 -66 -13 -60Z" fill="#2a1a10" />
      <Eye x={-5} y={-55} r={3.6} dx={0.6} />
      <Eye x={5} y={-55} r={3.6} dx={0.6} />
      <path d="M-4 -48Q0 -45 4 -48" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </>
  );
}

function HutScene() {
  return (
    <Frame>
      <defs>
        <linearGradient id="hut-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fd8ff" />
          <stop offset="60%" stopColor="#c8f4ff" />
          <stop offset="100%" stopColor="#fff1c2" />
        </linearGradient>
        <linearGradient id="hut-log" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a4b" />
          <stop offset="100%" stopColor="#8a5627" />
        </linearGradient>
        <radialGradient id="hut-skin" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#f2c79a" />
          <stop offset="100%" stopColor="#b97a4a" />
        </radialGradient>
      </defs>
      <rect width="270" height="480" fill="url(#hut-sky)" />

      {/* Sun crossing the sky, fast-forwarded */}
      <g>
        <animateMotion dur="8s" repeatCount="indefinite" path="M20 220Q135 -20 250 220" />
        <circle r="34" fill="#fff3a8" opacity="0.35" />
        <circle r="22" fill="#ffe680" />
      </g>
      {[0, 1].map((i) => (
        <g key={i} className="a-drift" style={{ animationDuration: `${5 + i * 2}s`, animationDelay: `${-i * 3}s` }}>
          <g transform={`translate(0 ${70 + i * 50})`} fill="#fff" opacity="0.85">
            <ellipse rx="28" ry="10" />
            <ellipse cx="14" cy="-7" rx="16" ry="10" />
          </g>
        </g>
      ))}

      {/* Jungle */}
      <path d="M0 250Q40 220 80 246Q120 214 170 244Q210 222 270 240V480H0Z" fill="#2f8f55" />
      <path d="M0 290Q60 262 120 286Q190 258 270 282V480H0Z" fill="#3aa864" />
      <Palm x={26} y={330} delay="0s" />
      <Palm x={248} y={336} flip delay="-1.5s" />
      {[[18, 330, 20], [52, 340, 16], [222, 338, 18], [258, 344, 22]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#2a8a4c" : "#3fb26a"} />
      ))}
      {[[40, 312], [70, 300], [210, 306], [236, 296], [120, 280]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#fff59a" className="twinkle svg-anim" style={{ "--delay": `${i * 0.6}s`, "--dur": "2s" } as React.CSSProperties} />
      ))}

      {/* Clearing and river */}
      <ellipse cx="135" cy="392" rx="160" ry="34" fill="#d1ab72" />
      <path d="M0 432Q70 416 140 434T270 428V480H0Z" fill="#4fc3f7" />
      {[444, 458].map((y, i) => (
        <g key={y} className="a-drift" style={{ animationDuration: `${3 + i}s`, animationDelay: `${-i * 1.2}s` }}>
          <path d={`M0 ${y}q10 -4 20 0`} stroke="#d8f6ff" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ))}

      {/* The hut, log by log */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = LOG_START[i];
        return (
          <g key={i}>
            <animateTransform attributeName="transform" type="translate" values="0 -70;0 -70;0 0;0 0" keyTimes={`0;${a};${a + 0.06};1`} {...BUILD} />
            <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes={`0;${a};${a + 0.02};0.9;0.97;1`} {...BUILD} />
            <rect x="98" y={368 - i * 12} width="74" height="12" rx="6" fill="url(#hut-log)" />
            <circle cx="99" cy={374 - i * 12} r="6" fill="#e3b27a" stroke="#9a6532" strokeWidth="1.5" />
            <circle cx="171" cy={374 - i * 12} r="6" fill="#e3b27a" stroke="#9a6532" strokeWidth="1.5" />
          </g>
        );
      })}
      <g>
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.68;0.7;0.9;0.97;1" {...BUILD} />
        <rect x="127" y="344" width="16" height="36" rx="8" fill="#3b2410" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 -90;0 -90;0 4;0 0;0 0" keyTimes="0;0.52;0.6;0.64;1" {...BUILD} />
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.52;0.53;0.9;0.97;1" {...BUILD} />
        <polygon points="86,324 184,324 135,266" fill="#6fbf3a" />
        <path d="M135 268L100 322M135 268L118 322M135 268L152 322M135 268L170 322" stroke="#9be05f" strokeWidth="2" />
        <path d="M86 324H184" stroke="#4e9a26" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Builder carrying a log */}
      <g transform="translate(60 384)">
        <g className="a-crawl" style={{ animationDuration: "3.2s" }}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="0.45s" repeatCount="indefinite" />
            <Builder shirt="#ff7a59">
              <path d="M-11 -40L-14 -64M11 -40L14 -64" stroke="url(#hut-skin)" strokeWidth="6" strokeLinecap="round" />
            </Builder>
            <rect x="-28" y="-80" width="56" height="11" rx="5.5" fill="url(#hut-log)" />
            <circle cx="-27" cy="-74.5" r="5.5" fill="#e3b27a" />
          </g>
        </g>
      </g>

      {/* Builder with a mallet */}
      <g transform="translate(210 384)">
        <Builder shirt="#4df3ff">
          <g transform="translate(-11 -40)">
            <g className="a-wave origin-br" style={{ animationDuration: "0.4s" }}>
              <path d="M0 0L-12 -14" stroke="url(#hut-skin)" strokeWidth="6" strokeLinecap="round" />
              <path d="M-12 -14L-20 -30" stroke="#8a5a2b" strokeWidth="3.5" strokeLinecap="round" />
              <rect x="-30" y="-38" width="18" height="10" rx="3" fill="#8a5627" />
            </g>
          </g>
        </Builder>
        <path d="M-12 -82L12 -82" stroke="#ffcf5a" strokeWidth="4" strokeLinecap="round" />
        <Sparkle x={-34} y={-30} s={0.5} delay="0s" color="#ffe680" />
      </g>
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// 06 Outrun: a runner, stone walls closing in, light behind.
// ---------------------------------------------------------------------------

const mazeShape = (e: number, f: number) => ({
  left: `0,0 ${e},190 ${e},290 0,480`,
  right: `270,0 ${f},190 ${f},290 270,480`,
  floor: `0,480 ${e},290 ${f},290 270,480`,
  sky: `0,0 270,0 ${f},190 ${e},190`,
});
const MAZE_OPEN = mazeShape(110, 160);
const MAZE_SHUT = mazeShape(124, 146);
const MAZE_ANIM = {
  dur: "5s",
  repeatCount: "indefinite",
  calcMode: "spline",
  keyTimes: "0;0.5;1",
  keySplines: "0.45 0 0.55 1;0.45 0 0.55 1",
} as const;

function Shifting({ part }: { part: keyof typeof MAZE_OPEN }) {
  return <animate attributeName="points" values={`${MAZE_OPEN[part]};${MAZE_SHUT[part]};${MAZE_OPEN[part]}`} {...MAZE_ANIM} />;
}

const MORTAR = [0.12, 0.26, 0.4, 0.54, 0.68, 0.82, 0.94];
const wallY = (t: number, x: number) => 480 * t + (190 + 100 * t - 480 * t) * (x / 110);

function MazeScene() {
  return (
    <Frame>
      <defs>
        <radialGradient id="maze-skin" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#f2c79a" />
          <stop offset="100%" stopColor="#b97a4a" />
        </radialGradient>
        <linearGradient id="maze-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a5e" />
          <stop offset="100%" stopColor="#ff9a6b" />
        </linearGradient>
        <linearGradient id="maze-stone-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a5568" />
          <stop offset="100%" stopColor="#2a3040" />
        </linearGradient>
        <linearGradient id="maze-stone-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#566173" />
          <stop offset="100%" stopColor="#2a3040" />
        </linearGradient>
        <linearGradient id="maze-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4a3a" />
          <stop offset="100%" stopColor="#2b2219" />
        </linearGradient>
        <radialGradient id="maze-light" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffd88a" />
        </radialGradient>
        <radialGradient id="maze-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <clipPath id="maze-lclip">
          <polygon points={MAZE_OPEN.left}>
            <Shifting part="left" />
          </polygon>
        </clipPath>
        <clipPath id="maze-rclip">
          <polygon points={MAZE_OPEN.right}>
            <Shifting part="right" />
          </polygon>
        </clipPath>
      </defs>

      <polygon points={MAZE_OPEN.sky} fill="url(#maze-sky)">
        <Shifting part="sky" />
      </polygon>
      <rect x="110" y="190" width="50" height="100" fill="url(#maze-light)">
        <animate attributeName="x" values="110;124;110" {...MAZE_ANIM} />
        <animate attributeName="width" values="50;22;50" {...MAZE_ANIM} />
      </rect>
      <polygon points={MAZE_OPEN.floor} fill="url(#maze-floor)">
        <Shifting part="floor" />
      </polygon>
      <polygon points={MAZE_OPEN.left} fill="url(#maze-stone-l)">
        <Shifting part="left" />
      </polygon>
      <polygon points={MAZE_OPEN.right} fill="url(#maze-stone-r)">
        <Shifting part="right" />
      </polygon>

      {/* Stone courses */}
      <g clipPath="url(#maze-lclip)" stroke="#1e2330" strokeWidth="2" opacity="0.7">
        {MORTAR.map((t, i) => (
          <line key={t} x1="0" y1={480 * t} x2="124" y2={190 + 100 * t + (i ? 0 : 0)} />
        ))}
        {MORTAR.slice(0, -1).map((t, i) => {
          const x = i % 2 ? 30 : 62;
          return <line key={`v${t}`} x1={x} y1={wallY(t, x)} x2={x} y2={wallY(MORTAR[i + 1], x)} />;
        })}
      </g>
      <g clipPath="url(#maze-rclip)" stroke="#1e2330" strokeWidth="2" opacity="0.7">
        {MORTAR.map((t) => (
          <line key={t} x1="270" y1={480 * t} x2="146" y2={190 + 100 * t} />
        ))}
        {MORTAR.slice(0, -1).map((t, i) => {
          const x = i % 2 ? 62 : 30;
          return <line key={`v${t}`} x1={270 - x} y1={wallY(t, x)} x2={270 - x} y2={wallY(MORTAR[i + 1], x)} />;
        })}
      </g>

      {/* Vines */}
      <g className="a-sway-slow origin-top">
        <path d="M30 0Q18 60 44 120Q62 170 48 230" stroke="#3fa34d" strokeWidth="4" fill="none" />
        {[[24, 40], [36, 90], [52, 140], [50, 190]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#5cc96a" transform={`rotate(${i % 2 ? 30 : -30} ${x} ${y})`} />
        ))}
      </g>
      <g className="a-sway-slow origin-top" style={{ animationDelay: "-2s" }}>
        <path d="M244 0Q256 70 228 140Q214 190 226 250" stroke="#3fa34d" strokeWidth="4" fill="none" />
        {[[250, 50], [236, 110], [222, 170], [228, 220]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#5cc96a" transform={`rotate(${i % 2 ? -30 : 30} ${x} ${y})`} />
        ))}
      </g>

      <circle cx="135" cy="240" r="90" fill="url(#maze-glow)" />
      {[[100, 220], [170, 250], [120, 300], [150, 200], [90, 330], [190, 320]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill="#fff3c4" className="twinkle svg-anim" style={{ "--delay": `${i * 0.5}s`, "--dur": "2.6s" } as React.CSSProperties} />
      ))}

      {/* Floor rushing past */}
      {[
        [135, 135],
        [128, 40],
        [142, 230],
      ].map(([x1, x2], i) => (
        <line key={i} x1={x1} y1="292" x2={x2} y2="480" stroke="#7a6652" strokeWidth="3" strokeDasharray="10 16" opacity="0.6">
          <animate attributeName="stroke-dashoffset" values="0;-26" dur="0.35s" repeatCount="indefinite" />
        </line>
      ))}

      {/* The runner */}
      <g transform="translate(135 376) scale(1.35)">
        <ellipse cx="0" cy="1" rx="20" ry="4" fill="#000" opacity="0.35" />
        {[-10, 10].map((x, i) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <circle r="5" fill="#cbb79e" opacity="0.6" className="a-steam" style={{ animationDuration: "0.6s", animationDelay: `${-i * 0.3}s` }} />
          </g>
        ))}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="0.3s" repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="0.6s" repeatCount="indefinite" />
            <path d="M-6 -30L-8 -6" stroke="#2b2350" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="-8" cy="-3" rx="6" ry="4" fill="#fff" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 -8;0 0;0 -8" dur="0.6s" repeatCount="indefinite" />
            <path d="M6 -30L8 -6" stroke="#2b2350" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="8" cy="-3" rx="6" ry="4" fill="#fff" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="25 -14 -56;-25 -14 -56;25 -14 -56" dur="0.6s" repeatCount="indefinite" />
            <path d="M-14 -56L-22 -40" stroke="#ff7a59" strokeWidth="7" strokeLinecap="round" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-25 14 -56;25 14 -56;-25 14 -56" dur="0.6s" repeatCount="indefinite" />
            <path d="M14 -56L22 -40" stroke="#ff7a59" strokeWidth="7" strokeLinecap="round" />
          </g>
          <rect x="-16" y="-62" width="32" height="36" rx="12" fill="#ff7a59" />
          <path d="M-9 -60L-7 -32M9 -60L7 -32" stroke="#8a2f1c" strokeWidth="2.5" opacity="0.6" />
          <circle cy="-76" r="17" fill="url(#maze-skin)" />
          <path d="M-17 -80Q-14 -96 0 -94Q14 -96 17 -80Q10 -88 4 -84Q-2 -90 -8 -84Q-12 -88 -17 -80Z" fill="#3a2414" />
          <Eye x={-6} y={-77} r={4.6} dx={-1.6} dy={0.3} />
          <Eye x={6} y={-77} r={4.6} dx={-1.6} dy={0.3} />
          <path d="M-11 -85L-3 -83M11 -85L3 -83" stroke="#3a2414" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="0" cy="-66" rx="3.4" ry="2.6" fill={INK}>
            <animate attributeName="ry" values="2.6;3.6;2.6" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <g transform="translate(19 -86)">
            <path d="M0 -6Q4 0 0 4Q-4 0 0 -6Z" fill="#7fd8ff" className="a-float svg-anim" />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export const SCENES: Record<SceneKey, () => React.ReactElement> = {
  race: RaceScene,
  hustle: HustleScene,
  patrol: PatrolScene,
  cut: CutScene,
  hut: HutScene,
  maze: MazeScene,
};
