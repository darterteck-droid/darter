"use client";

import { useSyncExternalStore } from "react";

// Tiny shared flag so the hero can wait for the intro curtain to lift.
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}

// Lets the 3D scene drive the custom cursor label.
export function setCursorLabel(label: string | null) {
  window.dispatchEvent(new CustomEvent("cursor-label", { detail: label }));
}
