// Canvas drawing for The Slice: glossy whole fruit with little faces, and the
// cross-sections you see once they're cut. Everything scales off the radius.

const TAU = Math.PI * 2;

export type SeedPattern = "watermelon" | "kiwi" | "citrus" | "dragon" | "stone";
export type Shape = "round" | "oval" | "lemon" | "dragon";

export type FruitKind = {
  name: string;
  size: number;
  shape: Shape;
  skin: [light: string, mid: string, dark: string];
  rind: string;
  pith: string | null;
  flesh: string;
  fleshCenter: string;
  juice: string;
  seeds: SeedPattern;
  leaf?: boolean;
};

export const FRUITS: FruitKind[] = [
  {
    name: "watermelon",
    size: 1.3,
    shape: "oval",
    skin: ["#8be78a", "#2f9e4a", "#11512a"],
    rind: "#2a8a3e",
    pith: "#e9ffd8",
    flesh: "#ff2e55",
    fleshCenter: "#ff7a90",
    juice: "#ff3157",
    seeds: "watermelon",
  },
  {
    name: "orange",
    size: 1,
    shape: "round",
    skin: ["#ffd79a", "#ff9418", "#c9520a"],
    rind: "#ff8a00",
    pith: "#fff1d2",
    flesh: "#ff9f1c",
    fleshCenter: "#ffc96b",
    juice: "#ffa31f",
    seeds: "citrus",
    leaf: true,
  },
  {
    name: "kiwi",
    size: 0.92,
    shape: "oval",
    skin: ["#c8a074", "#8a5a34", "#4a2a12"],
    rind: "#6b4423",
    pith: null,
    flesh: "#6fcf3a",
    fleshCenter: "#c2f285",
    juice: "#8fe05a",
    seeds: "kiwi",
  },
  {
    name: "lemon",
    size: 0.95,
    shape: "lemon",
    skin: ["#fff7a8", "#ffe23d", "#d4a800"],
    rind: "#f2cf00",
    pith: "#fffbe3",
    flesh: "#fff06a",
    fleshCenter: "#fffbd0",
    juice: "#ffeb3b",
    seeds: "citrus",
  },
  {
    name: "dragon fruit",
    size: 1.05,
    shape: "dragon",
    skin: ["#ff9fd8", "#ff2f9e", "#a3005f"],
    rind: "#ff2f9e",
    pith: null,
    flesh: "#f6f1ff",
    fleshCenter: "#ffffff",
    juice: "#ff7ad1",
    seeds: "dragon",
  },
  {
    name: "peach",
    size: 1,
    shape: "round",
    skin: ["#ffd8b0", "#ff9a6b", "#d9485a"],
    rind: "#ff8a65",
    pith: null,
    flesh: "#ffc56b",
    fleshCenter: "#ffe3a8",
    juice: "#ffb35c",
    seeds: "stone",
    leaf: true,
  },
];

type Palette = Pick<FruitKind, "skin" | "rind" | "pith" | "flesh" | "fleshCenter" | "juice">;

const GOLDEN: Palette = {
  skin: ["#fff7c7", "#ffcc29", "#a87b00"],
  rind: "#e6a800",
  pith: "#fff4bf",
  flesh: "#ffe066",
  fleshCenter: "#fff8d6",
  juice: "#ffd23f",
};

export function palette(kind: FruitKind, golden: boolean): Palette {
  if (!golden) return kind;
  return { ...GOLDEN, pith: kind.pith ? GOLDEN.pith : null };
}

export type Fruit = {
  id: number;
  kind: FruitKind;
  golden: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  r: number;
  seed: number;
  shock: number;
  blinkAt: number;
  blinkUntil: number;
};

export type Half = {
  kind: FruitKind;
  golden: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  r: number;
  seed: number;
  /** World angle of the cut at the moment it happened. */
  angle: number;
  side: 1 | -1;
  life: number;
};

export function hitRadius(f: Fruit) {
  return f.r * (f.kind.shape === "oval" || f.kind.shape === "lemon" ? 1.12 : 1.02);
}

/** Small seeded RNG so both halves of a fruit get the same seeds. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ctx = CanvasRenderingContext2D;

function circle(ctx: Ctx, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}

function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
  ctx.fill();
}

function star(ctx: Ctx, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.25, y - s * 0.25);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x + s * 0.25, y + s * 0.25);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s * 0.25, y + s * 0.25);
  ctx.lineTo(x - s, y);
  ctx.lineTo(x - s * 0.25, y - s * 0.25);
  ctx.closePath();
  ctx.fill();
}

function shapePath(ctx: Ctx, shape: Shape, r: number) {
  ctx.beginPath();
  switch (shape) {
    case "oval":
      ctx.ellipse(0, 0, r * 1.14, r * 0.94, 0, 0, TAU);
      break;
    case "lemon":
      ctx.ellipse(0, 0, r * 1.12, r * 0.92, 0, 0, TAU);
      ctx.moveTo(r * 1.3, 0);
      ctx.ellipse(r * 1.12, 0, r * 0.18, r * 0.16, 0, 0, TAU);
      ctx.moveTo(-r * 0.94, 0);
      ctx.ellipse(-r * 1.12, 0, r * 0.18, r * 0.16, 0, 0, TAU);
      break;
    case "dragon":
      ctx.ellipse(0, 0, r * 0.94, r * 1.06, 0, 0, TAU);
      break;
    default:
      ctx.arc(0, 0, r, 0, TAU);
  }
}

// Spikes, stems and leaves sit outside the body outline.
function drawBehind(ctx: Ctx, kind: FruitKind, pal: Palette, r: number) {
  if (kind.shape === "dragon") {
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU;
      const b1x = Math.cos(a - 0.2) * r * 0.86;
      const b1y = Math.sin(a - 0.2) * r * 0.98;
      const b2x = Math.cos(a + 0.2) * r * 0.86;
      const b2y = Math.sin(a + 0.2) * r * 0.98;
      const tx = Math.cos(a + 0.3) * r * 1.36;
      const ty = Math.sin(a + 0.3) * r * 1.46;
      const g = ctx.createLinearGradient((b1x + b2x) / 2, (b1y + b2y) / 2, tx, ty);
      g.addColorStop(0, pal.skin[1]);
      g.addColorStop(1, "#9be15d");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(b1x, b1y);
      ctx.quadraticCurveTo(Math.cos(a) * r * 1.2, Math.sin(a) * r * 1.3, tx, ty);
      ctx.lineTo(b2x, b2y);
      ctx.closePath();
      ctx.fill();
    }
  }
  if (kind.leaf) {
    ctx.strokeStyle = "#6b3f1d";
    ctx.lineWidth = r * 0.07;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.9);
    ctx.lineTo(r * 0.04, -r * 1.14);
    ctx.stroke();
    ctx.fillStyle = "#59c46a";
    ellipse(ctx, r * 0.27, -r * 1.1, r * 0.26, r * 0.11, -0.45);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ellipse(ctx, r * 0.22, -r * 1.13, r * 0.12, r * 0.03, -0.45);
  }
}

function drawSkin(ctx: Ctx, kind: FruitKind, pal: Palette, r: number, seed: number) {
  const rand = rng(seed);
  switch (kind.seeds) {
    case "watermelon": {
      ctx.strokeStyle = pal.skin[2];
      ctx.lineWidth = r * 0.13;
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.85;
      for (let k = -4; k <= 4; k++) {
        const x0 = k * r * 0.3;
        ctx.beginPath();
        for (let y = -r * 1.2; y <= r * 1.2; y += r * 0.1) {
          const x = x0 + Math.sin((y / r) * 5 + k) * r * 0.07;
          if (y === -r * 1.2) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
    case "kiwi": {
      for (let i = 0; i < 70; i++) {
        ctx.fillStyle = i % 2 ? `${pal.skin[0]}59` : `${pal.skin[2]}4d`;
        circle(ctx, (rand() * 2 - 1) * r * 1.1, (rand() * 2 - 1) * r, r * 0.022);
      }
      break;
    }
    case "citrus": {
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      for (let i = 0; i < 46; i++) circle(ctx, (rand() * 2 - 1) * r * 1.1, (rand() * 2 - 1) * r, r * 0.018);
      break;
    }
    case "dragon": {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU + 0.3;
        const d = r * 0.55;
        ctx.fillStyle = `${pal.skin[0]}5c`;
        ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d, r * 0.28, r * 0.13, a);
        ctx.fillStyle = "rgba(155,225,93,0.9)";
        ellipse(ctx, Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8, r * 0.07, r * 0.04, a);
      }
      break;
    }
    case "stone": {
      const blush = ctx.createRadialGradient(r * 0.35, -r * 0.05, 0, r * 0.35, -r * 0.05, r * 0.85);
      blush.addColorStop(0, "rgba(255,60,90,0.6)");
      blush.addColorStop(1, "rgba(255,60,90,0)");
      ctx.fillStyle = blush;
      ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);
      ctx.strokeStyle = `${pal.skin[2]}55`;
      ctx.lineWidth = r * 0.05;
      ctx.beginPath();
      ctx.moveTo(-r * 0.05, -r * 0.95);
      ctx.quadraticCurveTo(-r * 0.42, 0, -r * 0.14, r * 0.92);
      ctx.stroke();
      break;
    }
  }
}

function drawFace(ctx: Ctx, r: number, shock: number, blink: boolean) {
  const scared = shock > 0.35;
  const er = r * (scared ? 0.15 : 0.12);
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * r * 0.3, -r * 0.06);
    ctx.scale(1, blink && !scared ? 0.12 : 1);
    ctx.fillStyle = "#ffffff";
    circle(ctx, 0, 0, er);
    ctx.fillStyle = "#170a22";
    circle(ctx, r * 0.015, r * 0.02, er * (scared ? 0.4 : 0.6));
    ctx.fillStyle = "#ffffff";
    circle(ctx, -er * 0.22, -er * 0.3, er * 0.24);
    ctx.restore();
  }
  ctx.fillStyle = "rgba(255,70,130,0.45)";
  ellipse(ctx, -r * 0.52, r * 0.14, r * 0.1, r * 0.06);
  ellipse(ctx, r * 0.52, r * 0.14, r * 0.1, r * 0.06);
  ctx.fillStyle = "#170a22";
  ctx.strokeStyle = "#170a22";
  if (scared) {
    ellipse(ctx, 0, r * 0.25, r * 0.08, r * 0.11);
  } else {
    ctx.lineWidth = r * 0.05;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, r * 0.1, r * 0.13, Math.PI * 0.18, Math.PI * 0.82);
    ctx.stroke();
  }
}

export function drawWhole(ctx: Ctx, f: Fruit, t: number) {
  const pal = palette(f.kind, f.golden);
  const r = f.r;
  ctx.save();
  ctx.translate(f.x, f.y);

  if (f.golden) {
    const glow = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 2.3);
    glow.addColorStop(0, "rgba(255,214,64,0.5)");
    glow.addColorStop(1, "rgba(255,214,64,0)");
    ctx.fillStyle = glow;
    circle(ctx, 0, 0, r * 2.3);
  }

  ctx.fillStyle = "rgba(6,0,18,0.32)";
  ellipse(ctx, r * 0.14, r * 0.3, r * 1.05, r * 0.9);

  ctx.rotate(f.rot);
  drawBehind(ctx, f.kind, pal, r);
  shapePath(ctx, f.kind.shape, r);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = pal.skin[1];
  ctx.fillRect(-r * 1.6, -r * 1.6, r * 3.2, r * 3.2);
  drawSkin(ctx, f.kind, pal, r, f.seed);

  // Light comes from the room, not the fruit, so undo the spin for shading.
  ctx.rotate(-f.rot);
  const light = ctx.createRadialGradient(-r * 0.38, -r * 0.45, 0, -r * 0.38, -r * 0.45, r * 1.75);
  light.addColorStop(0, `${pal.skin[0]}e6`);
  light.addColorStop(0.3, `${pal.skin[0]}00`);
  light.addColorStop(0.68, "#00000000");
  light.addColorStop(1, `${pal.skin[2]}f2`);
  ctx.fillStyle = light;
  ctx.fillRect(-r * 1.6, -r * 1.6, r * 3.2, r * 3.2);

  ctx.rotate(f.rot);
  drawFace(ctx, r, f.shock, t < f.blinkUntil);
  ctx.rotate(-f.rot);

  ctx.lineWidth = r * 0.08;
  ctx.strokeStyle = "rgba(111,214,227,0.5)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.95, Math.PI * 0.1, Math.PI * 0.62);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,176,96,0.45)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.95, Math.PI * 0.72, Math.PI * 1.02);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ellipse(ctx, -r * 0.36, -r * 0.5, r * 0.2, r * 0.1, -0.55);
  circle(ctx, -r * 0.1, -r * 0.66, r * 0.04);
  ctx.restore();

  if (f.golden) {
    ctx.fillStyle = "#fff6c2";
    for (let i = 0; i < 3; i++) {
      const a = t * 1.6 + (i * TAU) / 3;
      star(ctx, Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5, r * 0.2 * (0.6 + 0.4 * Math.sin(t * 6 + i)));
    }
  }
  ctx.restore();
}

function drawSeeds(ctx: Ctx, kind: FruitKind, pal: Palette, r: number, seed: number) {
  const rand = rng(seed ^ 0x9e3779b9);
  switch (kind.seeds) {
    case "watermelon": {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU + rand() * 0.25;
        const d = r * (0.38 + rand() * 0.16);
        ctx.save();
        ctx.translate(Math.cos(a) * d, Math.sin(a) * d);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = "#1c0d10";
        ellipse(ctx, 0, 0, r * 0.04, r * 0.07);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ellipse(ctx, -r * 0.012, -r * 0.025, r * 0.012, r * 0.02);
        ctx.restore();
      }
      break;
    }
    case "kiwi": {
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = r * 0.02;
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * TAU;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2);
        ctx.lineTo(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.72);
        ctx.stroke();
      }
      ctx.fillStyle = "#f6fadf";
      ellipse(ctx, 0, 0, r * 0.2, r * 0.16);
      ctx.fillStyle = "#1b1206";
      for (let i = 0; i < 30; i++) {
        const a = (i / 30) * TAU + rand() * 0.1;
        const d = r * (0.27 + rand() * 0.09);
        ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d, r * 0.035, r * 0.016, a);
      }
      break;
    }
    case "citrus": {
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      for (let i = 0; i < 40; i++) {
        const a = rand() * TAU;
        const d = Math.sqrt(rand()) * r * 0.74;
        ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d, r * 0.03, r * 0.012, a);
      }
      const line = pal.pith ?? "#fff4d6";
      ctx.strokeStyle = line;
      ctx.lineWidth = r * 0.04;
      ctx.lineCap = "round";
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.08, Math.sin(a) * r * 0.08);
        ctx.lineTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78);
        ctx.stroke();
      }
      ctx.fillStyle = line;
      circle(ctx, 0, 0, r * 0.09);
      break;
    }
    case "dragon": {
      ctx.fillStyle = "#14080f";
      for (let i = 0; i < 80; i++) {
        const a = rand() * TAU;
        const d = Math.sqrt(rand()) * r * 0.8;
        circle(ctx, Math.cos(a) * d, Math.sin(a) * d, r * (0.016 + rand() * 0.014));
      }
      break;
    }
    case "stone": {
      ctx.fillStyle = "rgba(230,70,60,0.3)";
      circle(ctx, 0, 0, r * 0.42);
      const pit = ctx.createRadialGradient(-r * 0.06, -r * 0.08, 0, 0, 0, r * 0.36);
      pit.addColorStop(0, "#d27a3a");
      pit.addColorStop(1, "#7a3412");
      ctx.fillStyle = pit;
      ellipse(ctx, 0, 0, r * 0.28, r * 0.34);
      ctx.strokeStyle = "rgba(60,20,5,0.55)";
      ctx.lineWidth = r * 0.02;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * r * 0.08, -r * 0.28);
        ctx.quadraticCurveTo(i * r * 0.12, 0, i * r * 0.08, r * 0.28);
        ctx.stroke();
      }
      break;
    }
  }
}

function drawCrossSection(ctx: Ctx, kind: FruitKind, pal: Palette, r: number, seed: number) {
  ctx.fillStyle = pal.skin[2];
  circle(ctx, 0, 0, r);
  ctx.fillStyle = pal.rind;
  circle(ctx, 0, 0, r * 0.94);
  let fleshR = r * 0.86;
  if (pal.pith) {
    ctx.fillStyle = pal.pith;
    circle(ctx, 0, 0, r * 0.86);
    fleshR = r * 0.8;
  }
  const flesh = ctx.createRadialGradient(0, 0, 0, 0, 0, fleshR);
  flesh.addColorStop(0, pal.fleshCenter);
  flesh.addColorStop(1, pal.flesh);
  ctx.fillStyle = flesh;
  circle(ctx, 0, 0, fleshR);
  drawSeeds(ctx, kind, pal, r, seed);
  const shine = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, -r * 0.3, -r * 0.3, r * 0.9);
  shine.addColorStop(0, "rgba(255,255,255,0.35)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  circle(ctx, 0, 0, fleshR);
}

export function drawHalf(ctx: Ctx, h: Half) {
  const pal = palette(h.kind, h.golden);
  const r = h.r * (h.kind.shape === "oval" || h.kind.shape === "lemon" ? 1.06 : 1);
  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.globalAlpha = Math.max(0, Math.min(1, 1 - (h.life - 1.8) / 0.8));
  ctx.rotate(h.rot + h.angle);
  // Keep only this half's side of the cut line.
  ctx.beginPath();
  ctx.rect(-r * 1.6, h.side > 0 ? 0 : -r * 1.6, r * 3.2, r * 1.6);
  ctx.clip();
  drawCrossSection(ctx, h.kind, pal, r, h.seed);
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = r * 0.08;
  ctx.beginPath();
  ctx.moveTo(-r * 0.88, 0);
  ctx.lineTo(r * 0.88, 0);
  ctx.stroke();
  ctx.restore();
}
