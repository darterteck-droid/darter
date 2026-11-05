"use client";

import { useSyncExternalStore } from "react";
import { sfx } from "./sfx";

// The site's game layer. Everything a visitor does earns "views", views climb
// ranks, and a few moments unlock achievements. Progress is remembered in this
// browser so a return visit picks up where they left off.

export const RANKS = [
  { at: 0, title: "Nobody" },
  { at: 2_500, title: "Up & Comer" },
  { at: 15_000, title: "Rising Star" },
  { at: 60_000, title: "Main Character" },
  { at: 250_000, title: "Going Viral" },
  { at: 1_000_000, title: "Legend" },
] as const;

export const ACHIEVEMENTS = {
  "first-boop": { title: "First boop", body: "He likes you.", bonus: 500 },
  "first-slice": { title: "Fresh cut", body: "Your first slice.", bonus: 500 },
  "combo-3": { title: "Combo x3", body: "Three in one swipe.", bonus: 1_500 },
  "combo-5": { title: "Juicy", body: "Five in one swipe. Beautiful.", bonus: 5_000 },
  golden: { title: "Golden fruit", body: "The rare one.", bonus: 3_000 },
  "maze-start": { title: "Into the maze", body: "No turning back.", bonus: 500 },
  "skip-eaten": { title: "Skip the skippers", body: "You ate a Skip bot.", bonus: 3_000 },
  "maze-clear": { title: "Maze cleared", body: "Every last view.", bonus: 25_000 },
  cast: { title: "Casting director", body: "You made a hero.", bonus: 1_000 },
  speed: { title: "Speed demon", body: "That was some fast scrolling.", bonus: 1_000 },
  explorer: { title: "Explorer", body: "You've seen it all.", bonus: 5_000 },
  "sound-on": { title: "Sound on", body: "Now you're really watching.", bonus: 500 },
  hooked: { title: "Hooked", body: "You watched the whole film.", bonus: 5_000 },
  "double-tap": { title: "Double tap", body: "You liked it. We knew you would.", bonus: 500 },
  "doom-scroller": { title: "Doom scroller", body: "You swiped the whole feed.", bonus: 3_000 },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

export type Burst = { id: number; amount: number; x: number; y: number; label?: string };
export type Toast = { id: number; achievement: AchievementId };

type State = {
  views: number;
  lastGain: number;
  gainId: number;
  bursts: Burst[];
  toasts: Toast[];
  rankUp: number | null;
  unlocked: AchievementId[];
};

const STORAGE_KEY = "darter-views-v1";
const INITIAL: State = { views: 0, lastGain: 0, gainId: 0, bursts: [], toasts: [], rankUp: null, unlocked: [] };

let state: State = INITIAL;
let loaded = false;
let uid = 0;
let saveTimer = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function save() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ views: state.views, unlocked: state.unlocked }));
    } catch {}
  }, 400);
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as { views?: unknown; unlocked?: unknown };
    const ids = Object.keys(ACHIEVEMENTS);
    state = {
      ...state,
      views: Math.max(0, Math.floor(Number(data.views) || 0)),
      unlocked: Array.isArray(data.unlocked)
        ? (data.unlocked.filter((x) => typeof x === "string" && ids.includes(x)) as AchievementId[])
        : [],
    };
  } catch {}
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
  save();
}

export function rankIndex(views: number) {
  let i = 0;
  while (i < RANKS.length - 1 && views >= RANKS[i + 1].at) i++;
  return i;
}

/** Progress (0 to 1) from the current rank to the next one. */
export function rankProgress(views: number) {
  const i = rankIndex(views);
  if (i === RANKS.length - 1) return 1;
  return (views - RANKS[i].at) / (RANKS[i + 1].at - RANKS[i].at);
}

/**
 * Add views. Pass a screen position (clientX / clientY) to fly a "+amount"
 * burst from that spot up to the counter in the nav. Leave it out for quiet
 * increments, like maze pellets.
 */
export function addViews(amount: number, at?: { x: number; y: number; label?: string }) {
  load();
  const gain = Math.round(amount);
  if (gain <= 0) return;
  const before = rankIndex(state.views);
  const views = state.views + gain;
  const after = rankIndex(views);
  const bursts = at ? [...state.bursts, { id: ++uid, amount: gain, ...at }].slice(-16) : state.bursts;
  set({
    views,
    lastGain: gain,
    gainId: state.gainId + 1,
    bursts,
    rankUp: after > before ? after : state.rankUp,
  });
  if (after > before) sfx.rankUp();
}

export function removeBurst(id: number) {
  set({ bursts: state.bursts.filter((b) => b.id !== id) });
}

/** Unlock an achievement once per visitor. Shows a toast and pays its bonus. */
export function unlock(id: AchievementId) {
  load();
  if (state.unlocked.includes(id)) return;
  const toast = { id: ++uid, achievement: id };
  set({ unlocked: [...state.unlocked, id], toasts: [...state.toasts, toast] });
  sfx.achievement();
  addViews(ACHIEVEMENTS[id].bonus);
  window.setTimeout(() => dismissToast(toast.id), 3400);
}

export function dismissToast(id: number) {
  set({ toasts: state.toasts.filter((t) => t.id !== id) });
}

export function dismissRankUp() {
  set({ rankUp: null });
}

function subscribe(l: () => void) {
  const wasLoaded = loaded;
  load();
  listeners.add(l);
  if (!wasLoaded) queueMicrotask(emit);
  return () => {
    listeners.delete(l);
  };
}

/** The whole game state. Re-renders on any change, so keep consumers small. */
export function useGame() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL,
  );
}

export function useViews() {
  return useSyncExternalStore(
    subscribe,
    () => state.views,
    () => 0,
  );
}

export function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 10_000) return `${Math.floor(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
