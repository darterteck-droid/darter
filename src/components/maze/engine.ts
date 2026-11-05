// The Maze: a small canvas maze-chase engine. Plain class, no React, so the
// component only has to mount it, size it, and forward input.

import { addViews, unlock } from "@/lib/views";
import { sfx } from "@/lib/sfx";

// # wall   . view pellet   $ coin   o "Go Viral" orb   - pen door
// E pen    P player start  (space) open path, nothing on it
const MAP = [
  "###############",
  "#o....###....o#",
  "#.###.###.###.#",
  "#......$......#",
  "#.##.#.#.#.##.#",
  "#....#.$.#....#",
  "##.#.......#.##",
  "#..#.##-##.#..#",
  "#.##.#EEE#.##.#",
  "#....#####....#",
  "#.#....P....#.#",
  "#.#.###.###.#.#",
  "#...#.$.$.#...#",
  "###.#.###.#.###",
  "#o....###....o#",
  "#.............#",
  "###############",
];

export const COLS = MAP[0].length;
export const ROWS = MAP.length;

const WALL = 0;
const PATH = 1;
const DOOR = 2;
const PEN = 3;

const NONE = 0;
const PELLET = 1;
const COIN = 2;
const ORB = 3;

export type Dir = 0 | 1 | 2 | 3; // up, right, down, left
const DX = [0, 1, 0, -1] as const;
const DY = [-1, 0, 1, 0] as const;
const reverse = (d: Dir) => ((d + 2) % 4) as Dir;
const DIRS: Dir[] = [0, 1, 2, 3];

const idx = (c: number, r: number) => r * COLS + c;

const TILES = new Uint8Array(COLS * ROWS);
const START_ITEMS = new Uint8Array(COLS * ROWS);
let PLAYER_START = { c: 7, r: 10 };
const PEN_CELLS: { c: number; r: number }[] = [];
let DOOR_CELL = { c: 7, r: 7 };

MAP.forEach((row, r) => {
  [...row].forEach((ch, c) => {
    const i = idx(c, r);
    TILES[i] = ch === "#" ? WALL : ch === "-" ? DOOR : ch === "E" ? PEN : PATH;
    START_ITEMS[i] = ch === "." ? PELLET : ch === "$" ? COIN : ch === "o" ? ORB : NONE;
    if (ch === "P") PLAYER_START = { c, r };
    if (ch === "E") PEN_CELLS.push({ c, r });
    if (ch === "-") DOOR_CELL = { c, r };
  });
});

// The tile just outside the door, and the middle of the pen.
const EXIT = { c: DOOR_CELL.c, r: DOOR_CELL.r - 1 };
const PEN_CENTER = PEN_CELLS[Math.floor(PEN_CELLS.length / 2)];

type Mode = "player" | "out" | "door";

function open(c: number, r: number, mode: Mode) {
  if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return false;
  const t = TILES[idx(c, r)];
  if (t === WALL) return false;
  if (mode === "door") return true;
  return t === PATH;
}

function bfs(c: number, r: number, mode: Mode) {
  const dist = new Int16Array(COLS * ROWS).fill(-1);
  const queue = new Int16Array(COLS * ROWS);
  let head = 0;
  let tail = 0;
  dist[idx(c, r)] = 0;
  queue[tail++] = idx(c, r);
  while (head < tail) {
    const cur = queue[head++];
    const cc = cur % COLS;
    const cr = (cur / COLS) | 0;
    for (const d of DIRS) {
      const nc = cc + DX[d];
      const nr = cr + DY[d];
      if (!open(nc, nr, mode)) continue;
      const ni = idx(nc, nr);
      if (dist[ni] !== -1) continue;
      dist[ni] = dist[cur] + 1;
      queue[tail++] = ni;
    }
  }
  return dist;
}

const TO_EXIT = bfs(EXIT.c, EXIT.r, "door");
const TO_PEN = bfs(PEN_CENTER.c, PEN_CENTER.r, "door");
const far = (n: number) => (n < 0 ? 999 : n);

// An entity moves from one tile centre to the next; t runs 0 to 1 between them.
type Mover = { fc: number; fr: number; tc: number; tr: number; t: number; dir: Dir };
const mover = (c: number, r: number, dir: Dir): Mover => ({ fc: c, fr: r, tc: c, tr: r, t: 0, dir });
const posX = (m: Mover) => m.fc + (m.tc - m.fc) * m.t;
const posY = (m: Mover) => m.fr + (m.tr - m.fr) * m.t;
const isMoving = (m: Mover) => m.fc !== m.tc || m.fr !== m.tr;

function advance(m: Mover, dist: number, choose: (c: number, r: number) => Dir | -1) {
  if (!isMoving(m)) {
    const d = choose(m.fc, m.fr);
    if (d === -1) return;
    m.dir = d;
    m.tc = m.fc + DX[d];
    m.tr = m.fr + DY[d];
    m.t = 0;
  }
  m.t += dist;
  let guard = 0;
  while (m.t >= 1 && guard++ < 4) {
    m.t -= 1;
    m.fc = m.tc;
    m.fr = m.tr;
    const d = choose(m.fc, m.fr);
    if (d === -1) {
      m.t = 0;
      return;
    }
    m.dir = d;
    m.tc = m.fc + DX[d];
    m.tr = m.fr + DY[d];
  }
}

function flip(m: Mover) {
  [m.fc, m.tc] = [m.tc, m.fc];
  [m.fr, m.tr] = [m.tr, m.fr];
  m.t = 1 - m.t;
  m.dir = reverse(m.dir);
}

type Brain = "chase" | "ambush" | "wander";
type Bot = {
  m: Mover;
  brain: Brain;
  color: string;
  state: "pen" | "leaving" | "out" | "eaten";
  releaseAt: number;
  scared: boolean;
};

const BOTS: { brain: Brain; color: string; home: { c: number; r: number }; delay: number }[] = [
  { brain: "chase", color: "#ff7a59", home: PEN_CENTER, delay: 0.4 },
  { brain: "ambush", color: "#5b78ff", home: PEN_CELLS[0], delay: 3 },
  { brain: "wander", color: "#6fd6e3", home: PEN_CELLS[PEN_CELLS.length - 1], delay: 6 },
];

export type Phase = "idle" | "ready" | "playing" | "paused" | "caught" | "over" | "cleared";
export type Hud = { score: number; lives: number; round: number };

type Callbacks = {
  onPhase: (phase: Phase, hud: Hud) => void;
  onHud: (hud: Hud) => void;
};

const VIRAL_SECONDS = 6;
const TAU = Math.PI * 2;

export class MazeEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cb: Callbacks;

  private layer: HTMLCanvasElement | null = null;
  private width = 0;
  private cell = 0;
  private dpr = 1;
  private font = "sans-serif";

  private phase: Phase = "idle";
  private time = 0;
  private anim = 0;
  private readyUntil = 0;
  private phaseUntil = 0;
  private viralUntil = 0;

  private player = mover(PLAYER_START.c, PLAYER_START.r, 3);
  private desired: Dir = 3;
  private squash = 0;
  private mouth = 0;
  private bots: Bot[] = [];
  private items = new Uint8Array(START_ITEMS);
  private left = 0;
  private playerDist = bfs(PLAYER_START.c, PLAYER_START.r, "out");
  private playerTile = -1;

  private score = 0;
  private lives = 3;
  private round = 1;
  private lastChomp = 0;
  private chompAlt = false;

  private raf = 0;
  private last = 0;
  private running = false;
  private inView = true;
  private tabVisible = true;

  constructor(canvas: HTMLCanvasElement, cb: Callbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.cb = cb;
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-unbounded").trim();
    if (family) this.font = family;
    this.newRound();
  }

  // ---------- public controls ----------

  resize(width: number) {
    if (width <= 0) return;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.width = width;
    this.cell = width / COLS;
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(this.cell * ROWS * this.dpr);
    this.buildLayer();
    this.draw();
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.round = 1;
    this.newRound();
    unlock("maze-start");
    sfx.click();
    this.emitHud();
    this.readyUntil = this.time + 1.3;
    this.setPhase("ready");
    this.startLoop();
  }

  setDir(d: Dir) {
    this.desired = d;
    if (this.phase === "paused") {
      this.resume();
      return;
    }
    // Reversing is allowed any time, even mid-tile.
    if (this.phase === "playing" && isMoving(this.player) && d === reverse(this.player.dir)) flip(this.player);
  }

  resume() {
    if (this.phase !== "paused" || !this.active()) return;
    this.readyUntil = this.time + 0.9;
    this.setPhase("ready");
    this.startLoop();
  }

  /** Keys only belong to the game while it's actually being played on screen. */
  wantsKeys() {
    return this.inView && (this.phase === "playing" || this.phase === "ready" || this.phase === "paused");
  }

  setInView(v: boolean) {
    this.inView = v;
    this.visibilityChanged();
  }

  setTabVisible(v: boolean) {
    this.tabVisible = v;
    this.visibilityChanged();
  }

  destroy() {
    this.stopLoop();
  }

  // ---------- state ----------

  private active() {
    return this.inView && this.tabVisible;
  }

  private visibilityChanged() {
    if (this.active()) {
      // Mid-celebration or mid-crash timers just carry on.
      if (this.phase === "caught" || this.phase === "cleared") this.startLoop();
      return;
    }
    if (this.phase === "playing" || this.phase === "ready") {
      this.setPhase("paused");
      this.stopLoop();
      this.draw();
    } else if (this.phase === "caught" || this.phase === "cleared") {
      this.stopLoop();
    }
  }

  private setPhase(p: Phase) {
    this.phase = p;
    this.cb.onPhase(p, this.hud());
  }

  private hud(): Hud {
    return { score: this.score, lives: this.lives, round: this.round };
  }

  private emitHud() {
    this.cb.onHud(this.hud());
  }

  private speedScale() {
    return Math.min(1.35, 1 + (this.round - 1) * 0.07);
  }

  private newRound() {
    this.items = new Uint8Array(START_ITEMS);
    this.left = this.items.reduce((n, v) => n + (v !== NONE ? 1 : 0), 0);
    this.resetPositions();
  }

  private resetPositions() {
    this.player = mover(PLAYER_START.c, PLAYER_START.r, 3);
    this.desired = 3;
    this.squash = 0;
    this.viralUntil = 0;
    this.bots = BOTS.map((b) => ({
      m: mover(b.home.c, b.home.r, 0),
      brain: b.brain,
      color: b.color,
      state: "pen",
      releaseAt: this.time + b.delay,
      scared: false,
    }));
  }

  private client(px: number, py: number) {
    const r = this.canvas.getBoundingClientRect();
    const s = r.width / COLS;
    return { x: r.left + (px + 0.5) * s, y: r.top + (py + 0.5) * s };
  }

  // ---------- loop ----------

  private startLoop() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private stopLoop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.draw();
    if (this.running) this.raf = requestAnimationFrame(this.tick);
  };

  private update(dt: number) {
    this.time += dt;
    this.anim += dt;
    this.squash = Math.max(0, this.squash - dt * 6);

    switch (this.phase) {
      case "ready":
        if (this.time >= this.readyUntil) this.setPhase("playing");
        return;
      case "caught":
        if (this.time < this.phaseUntil) return;
        if (this.lives > 0) {
          this.resetPositions();
          this.readyUntil = this.time + 1.1;
          this.setPhase("ready");
        } else {
          this.setPhase("over");
          this.stopLoop();
        }
        return;
      case "cleared":
        if (this.time < this.phaseUntil) return;
        this.round += 1;
        this.newRound();
        this.emitHud();
        this.readyUntil = this.time + 1.2;
        this.setPhase("ready");
        return;
      case "playing":
        break;
      default:
        return;
    }

    const speed = this.speedScale();

    // Player
    const p = this.player;
    advance(p, 5.3 * speed * dt, (c, r) => {
      const d = this.desired;
      if (open(c + DX[d], r + DY[d], "player")) {
        if (d !== p.dir) this.squash = 1;
        return d;
      }
      if (open(c + DX[p.dir], r + DY[p.dir], "player")) return p.dir;
      return -1;
    });
    if (isMoving(p)) this.mouth += dt * 14;

    const px = posX(p);
    const py = posY(p);
    const nc = Math.round(px);
    const nr = Math.round(py);
    const tile = idx(nc, nr);
    if (tile !== this.playerTile) {
      this.playerTile = tile;
      this.playerDist = bfs(nc, nr, "out");
    }
    if (Math.abs(px - nc) + Math.abs(py - nr) < 0.45) this.eat(tile, nc, nr);
    if (this.phase !== "playing") return;

    // Viral mode wears off
    if (this.viralUntil && this.time >= this.viralUntil) {
      this.viralUntil = 0;
      this.bots.forEach((b) => (b.scared = false));
    }

    // Skip bots
    for (const bot of this.bots) {
      if (bot.state === "pen") {
        if (this.time >= bot.releaseAt) bot.state = "leaving";
        else continue;
      }
      const v =
        bot.state === "eaten" ? 9 : bot.scared ? 2.7 : bot.state === "leaving" ? 3.2 : 4.4 * speed;
      advance(bot.m, v * dt, (c, r) => this.botChoose(bot, c, r));
    }

    // Collisions
    for (const bot of this.bots) {
      if (bot.state === "pen" || bot.state === "eaten") continue;
      const dx = posX(bot.m) - px;
      const dy = posY(bot.m) - py;
      if (dx * dx + dy * dy > 0.36) continue;
      if (bot.scared) {
        bot.state = "eaten";
        bot.scared = false;
        this.score += 2000;
        this.emitHud();
        addViews(2000, { ...this.client(posX(bot.m), posY(bot.m)), label: "Skip bot" });
        sfx.pop();
        unlock("skip-eaten");
      } else {
        this.lives -= 1;
        this.emitHud();
        sfx.lose();
        this.phaseUntil = this.time + 1.4;
        this.setPhase("caught");
        return;
      }
    }
  }

  private eat(tile: number, c: number, r: number) {
    const item = this.items[tile];
    if (item === NONE) return;
    this.items[tile] = NONE;
    this.left -= 1;

    if (item === PELLET) {
      this.score += 25;
      addViews(25);
      if (this.time - this.lastChomp > 0.07) {
        this.chompAlt = !this.chompAlt;
        sfx.chomp(this.chompAlt);
        this.lastChomp = this.time;
      }
    } else if (item === COIN) {
      this.score += 500;
      addViews(500, { ...this.client(c, r), label: "$" });
      sfx.coin();
    } else if (item === ORB) {
      this.score += 100;
      addViews(100);
      sfx.power();
      this.viralUntil = this.time + VIRAL_SECONDS;
      for (const bot of this.bots) {
        if (bot.state !== "out" && bot.state !== "leaving") continue;
        if (!bot.scared && isMoving(bot.m)) flip(bot.m);
        bot.scared = true;
      }
    }
    this.emitHud();

    if (this.left === 0) {
      this.score += 5000;
      this.emitHud();
      sfx.win();
      unlock("maze-clear");
      addViews(5000, { ...this.client((COLS - 1) / 2, (ROWS - 1) / 2), label: "Cleared" });
      this.phaseUntil = this.time + 2.8;
      this.setPhase("cleared");
    }
  }

  private botChoose(bot: Bot, c: number, r: number): Dir | -1 {
    if (bot.state === "leaving" && c === EXIT.c && r === EXIT.r) bot.state = "out";
    if (bot.state === "eaten" && c === PEN_CENTER.c && r === PEN_CENTER.r) {
      bot.state = "pen";
      bot.releaseAt = this.time + 1.2;
      return -1;
    }

    const mode: Mode = bot.state === "out" ? "out" : "door";
    const back = reverse(bot.m.dir);
    let options = DIRS.filter((d) => d !== back && open(c + DX[d], r + DY[d], mode));
    if (!options.length) options = open(c + DX[back], r + DY[back], mode) ? [back] : [];
    if (!options.length) return -1;
    if (options.length === 1) return options[0];

    const next = (d: Dir) => idx(c + DX[d], r + DY[d]);
    const toPlayer = (d: Dir) => far(this.playerDist[next(d)]);
    const here = far(this.playerDist[idx(c, r)]);
    let cost: (d: Dir) => number;

    if (bot.state === "leaving") cost = (d) => far(TO_EXIT[next(d)]);
    else if (bot.state === "eaten") cost = (d) => far(TO_PEN[next(d)]);
    else if (bot.scared) cost = (d) => -toPlayer(d) + Math.random() * 2;
    else if (bot.brain === "chase") {
      // A little sloppy on purpose, so it can be outrun.
      if (Math.random() < 0.12) return options[Math.floor(Math.random() * options.length)];
      cost = toPlayer;
    } else if (bot.brain === "ambush") {
      const p = this.player;
      const tx = Math.max(0, Math.min(COLS - 1, Math.round(posX(p)) + DX[p.dir] * 4));
      const ty = Math.max(0, Math.min(ROWS - 1, Math.round(posY(p)) + DY[p.dir] * 4));
      cost = here <= 3 ? toPlayer : (d) => Math.hypot(c + DX[d] - tx, r + DY[d] - ty);
    } else {
      cost = here < 7 ? toPlayer : () => Math.random();
    }

    let best = options[0];
    let bestCost = Infinity;
    for (const d of options) {
      const v = cost(d);
      if (v < bestCost) {
        bestCost = v;
        best = d;
      }
    }
    return best;
  }

  // ---------- drawing ----------

  private buildLayer() {
    const { cell, dpr } = this;
    const w = this.width;
    const h = cell * ROWS;
    const layer = this.layer ?? document.createElement("canvas");
    layer.width = Math.round(w * dpr);
    layer.height = Math.round(h * dpr);
    const g = layer.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);

    const floor = g.createLinearGradient(0, 0, 0, h);
    floor.addColorStop(0, "#0e1628");
    floor.addColorStop(1, "#0a101c");
    g.fillStyle = floor;
    g.fillRect(0, 0, w, h);

    // Faint floor tiles
    g.strokeStyle = "rgba(255,255,255,0.025)";
    g.lineWidth = 1;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (TILES[idx(c, r)] !== WALL) g.strokeRect(c * cell + 0.5, r * cell + 0.5, cell - 1, cell - 1);

    // Pen glow
    g.fillStyle = "rgba(255,170,90,0.07)";
    for (const p of PEN_CELLS) g.fillRect(p.c * cell, p.r * cell, cell, cell);

    // Stone blocks
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (TILES[idx(c, r)] !== WALL) continue;
        const x = c * cell;
        const y = r * cell;
        g.fillStyle = "#132036";
        g.fillRect(x, y, cell, cell);
        g.fillStyle = "#1b2c4a";
        g.beginPath();
        g.roundRect(x + cell * 0.14, y + cell * 0.14, cell * 0.72, cell * 0.72, cell * 0.12);
        g.fill();
        g.fillStyle = "rgba(255,255,255,0.05)";
        g.fillRect(x + cell * 0.2, y + cell * 0.18, cell * 0.6, Math.max(1, cell * 0.05));
      }

    // Neon edges wherever stone meets the path
    const edges = new Path2D();
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (TILES[idx(c, r)] !== WALL) continue;
        const x = c * cell;
        const y = r * cell;
        for (const d of DIRS) {
          const nc = c + DX[d];
          const nr = r + DY[d];
          if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;
          if (TILES[idx(nc, nr)] === WALL) continue;
          if (d === 0) {
            edges.moveTo(x, y);
            edges.lineTo(x + cell, y);
          } else if (d === 1) {
            edges.moveTo(x + cell, y);
            edges.lineTo(x + cell, y + cell);
          } else if (d === 2) {
            edges.moveTo(x, y + cell);
            edges.lineTo(x + cell, y + cell);
          } else {
            edges.moveTo(x, y);
            edges.lineTo(x, y + cell);
          }
        }
      }
    const neon = g.createLinearGradient(0, 0, w, h);
    neon.addColorStop(0, "#ffe2a8");
    neon.addColorStop(0.5, "#ffc061");
    neon.addColorStop(1, "#ff8f5e");
    g.lineCap = "round";
    g.strokeStyle = neon;
    g.lineWidth = Math.max(1.5, cell * 0.09);
    g.shadowColor = "rgba(255,160,80,0.85)";
    g.shadowBlur = cell * 0.55;
    g.stroke(edges);
    g.stroke(edges);
    g.shadowBlur = 0;
    g.strokeStyle = "rgba(255,255,255,0.6)";
    g.lineWidth = Math.max(0.75, cell * 0.03);
    g.stroke(edges);

    // Pen door
    g.strokeStyle = "#ff7a8f";
    g.lineWidth = Math.max(2, cell * 0.12);
    g.shadowColor = "#ff7a8f";
    g.shadowBlur = cell * 0.4;
    g.beginPath();
    g.moveTo(DOOR_CELL.c * cell + cell * 0.08, DOOR_CELL.r * cell + cell * 0.5);
    g.lineTo(DOOR_CELL.c * cell + cell * 0.92, DOOR_CELL.r * cell + cell * 0.5);
    g.stroke();
    g.shadowBlur = 0;

    this.layer = layer;
  }

  private draw() {
    const { ctx, cell } = this;
    if (!cell || !this.layer) return;
    const w = this.width;
    const h = cell * ROWS;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(this.layer, 0, 0, w, h);

    if (this.viralUntil > this.time) {
      ctx.fillStyle = `rgba(127,224,176,${0.04 + 0.03 * Math.sin(this.anim * 8)})`;
      ctx.fillRect(0, 0, w, h);
    }

    this.drawItems();
    this.bots.forEach((bot, i) => this.drawBot(bot, i));
    this.drawPlayer();
  }

  private drawItems() {
    const { ctx, cell, items } = this;
    const halo = new Path2D();
    const core = new Path2D();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item === NONE) continue;
      const cx = ((i % COLS) + 0.5) * cell;
      const cy = (((i / COLS) | 0) + 0.5) * cell;
      if (item === PELLET) {
        halo.moveTo(cx + cell * 0.17, cy);
        halo.arc(cx, cy, cell * 0.17, 0, TAU);
        core.moveTo(cx + cell * 0.075, cy);
        core.arc(cx, cy, cell * 0.075, 0, TAU);
      } else if (item === COIN) {
        this.drawCoin(cx, cy);
      } else {
        this.drawOrb(cx, cy);
      }
    }
    ctx.fillStyle = "rgba(255,201,107,0.16)";
    ctx.fill(halo);
    ctx.fillStyle = "#fff6cf";
    ctx.fill(core);
  }

  private drawCoin(cx: number, cy: number) {
    const { ctx, cell } = this;
    const sx = Math.max(0.18, Math.abs(Math.cos(this.anim * 3 + cx * 0.05)));
    const r = cell * 0.3;
    ctx.save();
    ctx.translate(cx, cy + Math.sin(this.anim * 4 + cy) * cell * 0.04);
    ctx.scale(sx, 1);
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, 0, 0, 0, r);
    g.addColorStop(0, "#fff7c2");
    g.addColorStop(0.55, "#ffd23f");
    g.addColorStop(1, "#c98a12");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = Math.max(1, cell * 0.03);
    ctx.stroke();
    if (sx > 0.45) {
      ctx.fillStyle = "#7a4b00";
      ctx.font = `900 ${cell * 0.34}px ${this.font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, cell * 0.02);
    }
    ctx.restore();
  }

  private drawOrb(cx: number, cy: number) {
    const { ctx, cell } = this;
    const r = cell * 0.28 * (1 + Math.sin(this.anim * 6 + cx) * 0.12);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
    glow.addColorStop(0, "rgba(127,224,176,0.55)");
    glow.addColorStop(1, "rgba(127,224,176,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2, 0, TAU);
    ctx.fill();
    const core = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 0, cx, cy, r);
    core.addColorStop(0, "#e9fff4");
    core.addColorStop(0.55, "#7fe0b0");
    core.addColorStop(1, "#2fa37a");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
    // Lightning bolt
    const s = r;
    ctx.fillStyle = "#0d2119";
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.15, cy - s * 0.62);
    ctx.lineTo(cx - s * 0.3, cy + s * 0.08);
    ctx.lineTo(cx - s * 0.02, cy + s * 0.08);
    ctx.lineTo(cx - s * 0.14, cy + s * 0.62);
    ctx.lineTo(cx + s * 0.32, cy - s * 0.12);
    ctx.lineTo(cx + s * 0.04, cy - s * 0.12);
    ctx.closePath();
    ctx.fill();
  }

  private drawPlayer() {
    const { ctx, cell, player: p } = this;
    let r = cell * 0.4;
    let alpha = 1;
    if (this.phase === "caught") {
      const k = Math.max(0, (this.phaseUntil - this.time) / 1.4);
      r *= 0.3 + 0.7 * k;
      alpha = Math.floor(this.anim * 14) % 2 ? 0.4 : 1;
    }
    const x = (posX(p) + 0.5) * cell;
    const y = (posY(p) + 0.5) * cell;
    const horizontal = p.dir === 1 || p.dir === 3;
    const along = 1 - this.squash * 0.18;
    const across = 1 + this.squash * 0.14;
    const lx = DX[p.dir] * r * 0.14;
    const ly = DY[p.dir] * r * 0.14;
    const open = this.phase === "playing" && isMoving(p) ? 0.25 + 0.75 * Math.abs(Math.sin(this.mouth)) : 0.35;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.scale(horizontal ? along : across, horizontal ? across : along);

    // Glow + body
    ctx.shadowColor = "rgba(255,170,90,0.7)";
    ctx.shadowBlur = cell * 0.5;
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
    g.addColorStop(0, "#fff1cf");
    g.addColorStop(0.5, "#ff7a8f");
    g.addColorStop(1, "#ff7a5c");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.ellipse(-r * 0.38, -r * 0.52, r * 0.26, r * 0.12, -0.5, 0, TAU);
    ctx.fill();

    // Eyes look where it's going
    for (const side of [-1, 1]) {
      const ex = side * r * 0.34 + lx * 0.6;
      const ey = -r * 0.14 + ly * 0.6;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.27, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#140a22";
      ctx.beginPath();
      ctx.arc(ex + DX[p.dir] * r * 0.1, ey + DY[p.dir] * r * 0.1, r * 0.14, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ex + DX[p.dir] * r * 0.1 + r * 0.05, ey + DY[p.dir] * r * 0.1 - r * 0.05, r * 0.05, 0, TAU);
      ctx.fill();
    }

    // Round mouth that chomps
    const mx = lx * 0.8;
    const my = r * 0.44 + ly * 0.5;
    ctx.fillStyle = "#1a0b24";
    ctx.beginPath();
    ctx.ellipse(mx, my, r * 0.17, r * (0.05 + open * 0.15), 0, 0, TAU);
    ctx.fill();
    if (open > 0.5) {
      ctx.fillStyle = "#ff6b8b";
      ctx.beginPath();
      ctx.ellipse(mx, my + r * open * 0.07, r * 0.09, r * 0.045 * open, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawBot(bot: Bot, i: number) {
    const { ctx, cell } = this;
    const m = bot.m;
    const x = (posX(m) + 0.5) * cell;
    const bob = Math.sin(this.anim * (bot.state === "pen" ? 5 : 9) + i * 1.7) * cell * (bot.state === "pen" ? 0.08 : 0.03);
    const y = (posY(m) + 0.5) * cell + bob;
    const w = cell * 0.74;
    const h = cell * 0.62;
    const remaining = this.viralUntil - this.time;
    const flash = bot.scared && remaining < 1.6 && Math.floor(this.anim * 8) % 2 === 0;
    const body = bot.scared ? (flash ? "#ffffff" : "#bcd4ff") : bot.color;

    ctx.save();
    if (bot.state === "eaten") {
      // Just the screen floats home.
      ctx.globalAlpha = 0.6;
      this.drawScreen(x, y, w, h, bot, false);
      ctx.restore();
      return;
    }

    // Legs
    const step = Math.sin(this.anim * 16 + i) * cell * 0.04;
    ctx.fillStyle = bot.scared ? "#8ea6d6" : shade(bot.color, -0.35);
    ctx.beginPath();
    ctx.roundRect(x - w * 0.3, y + h * 0.36 - step, w * 0.18, cell * 0.16, cell * 0.04);
    ctx.roundRect(x + w * 0.12, y + h * 0.36 + step, w * 0.18, cell * 0.16, cell * 0.04);
    ctx.fill();

    // Antenna
    ctx.strokeStyle = bot.scared ? "#8ea6d6" : shade(bot.color, -0.25);
    ctx.lineWidth = Math.max(1, cell * 0.05);
    ctx.beginPath();
    ctx.moveTo(x, y - h * 0.5);
    ctx.lineTo(x + Math.sin(this.anim * 6 + i) * cell * 0.05, y - h * 0.5 - cell * 0.16);
    ctx.stroke();
    ctx.fillStyle = Math.floor(this.anim * 3 + i) % 2 ? "#ffc96b" : body;
    ctx.beginPath();
    ctx.arc(x + Math.sin(this.anim * 6 + i) * cell * 0.05, y - h * 0.5 - cell * 0.18, cell * 0.06, 0, TAU);
    ctx.fill();

    // Body
    const g = ctx.createLinearGradient(x, y - h / 2, x, y + h / 2);
    g.addColorStop(0, shade(body, 0.35));
    g.addColorStop(1, body);
    ctx.shadowColor = bot.scared ? "rgba(188,212,255,0.7)" : body;
    ctx.shadowBlur = cell * 0.35;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, cell * 0.16);
    ctx.fill();
    ctx.shadowBlur = 0;

    this.drawScreen(x, y, w, h, bot, bot.scared);
    ctx.restore();
  }

  private drawScreen(x: number, y: number, w: number, h: number, bot: Bot, scared: boolean) {
    const { ctx, cell } = this;
    ctx.fillStyle = "#140a24";
    ctx.beginPath();
    ctx.roundRect(x - w * 0.36, y - h * 0.3, w * 0.72, h * 0.52, cell * 0.09);
    ctx.fill();
    const sy = y - h * 0.04;

    if (scared) {
      // Worried little face
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x - w * 0.14, sy - h * 0.06, cell * 0.045, 0, TAU);
      ctx.arc(x + w * 0.14, sy - h * 0.06, cell * 0.045, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = Math.max(1, cell * 0.035);
      ctx.beginPath();
      const mw = w * 0.32;
      for (let k = 0; k <= 4; k++) {
        const px = x - mw / 2 + (mw / 4) * k;
        const py = sy + h * 0.1 + (k % 2 ? -1 : 1) * cell * 0.025;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      return;
    }

    // The skip symbol: two arrows and a bar, nudged toward where it's heading.
    const ox = DX[bot.m.dir] * cell * 0.03;
    const oy = DY[bot.m.dir] * cell * 0.03;
    const th = cell * 0.085;
    const tw = cell * 0.1;
    const start = x - tw - cell * 0.04 + ox;
    ctx.fillStyle = bot.state === "eaten" ? "#fff" : shade(bot.color, 0.55);
    ctx.beginPath();
    for (const k of [0, 1]) {
      const tx = start + k * tw;
      ctx.moveTo(tx, sy - th + oy);
      ctx.lineTo(tx + tw, sy + oy);
      ctx.lineTo(tx, sy + th + oy);
      ctx.closePath();
    }
    ctx.rect(start + tw * 2 + cell * 0.01, sy - th + oy, cell * 0.035, th * 2);
    ctx.fill();
  }
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
