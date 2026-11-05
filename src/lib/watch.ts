"use client";

import { useSyncExternalStore } from "react";

// Watch time: seconds this tab has been open and visible. Starts on first use.
let seconds = 0;
let started = false;
const listeners = new Set<() => void>();

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  window.setInterval(() => {
    if (document.visibilityState !== "visible") return;
    seconds += 1;
    listeners.forEach((l) => l());
  }, 1000);
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useWatchTime() {
  return useSyncExternalStore(
    subscribe,
    () => seconds,
    () => 0,
  );
}

export function formatClock(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
