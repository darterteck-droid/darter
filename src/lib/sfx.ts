"use client";

import { useSyncExternalStore } from "react";

// Tiny synth for UI sounds. Everything is generated with WebAudio, so there are
// no audio files. Sounds only ever play in response to something the visitor did.

const KEY = "darter-sound";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let enabled = true;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    enabled = localStorage.getItem(KEY) !== "off";
  } catch {}
}

function audio() {
  load();
  if (!enabled || typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

function tone(type: OscillatorType, from: number, to: number, dur: number, vol = 0.4, delay = 0) {
  const c = audio();
  if (!c || !master) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

function noise(dur: number, type: BiquadFilterType, fFrom: number, fTo: number, vol = 0.4, delay = 0, q = 1) {
  const c = audio();
  if (!c || !master || !noiseBuffer) return;
  const t = c.currentTime + delay;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(fFrom, t);
  filter.frequency.exponentialRampToValueAtTime(Math.max(1, fTo), t + dur);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(master);
  src.start(t);
  src.stop(t + dur + 0.03);
}

const notes = (freqs: number[], step: number, dur: number, vol: number, type: OscillatorType = "triangle") =>
  freqs.forEach((f, i) => tone(type, f, f, dur, vol, i * step));

export const sfx = {
  boop: () => tone("sine", 380, 780, 0.16, 0.5),
  pop: () => tone("sine", 520, 1400, 0.09, 0.4),
  click: () => tone("square", 1600, 1200, 0.03, 0.06),
  whoosh: () => noise(0.32, "bandpass", 300, 2600, 0.3, 0, 0.8),
  slice: () => {
    noise(0.16, "highpass", 2000, 7500, 0.32);
    tone("triangle", 2600, 1900, 0.1, 0.06);
  },
  squish: () => {
    noise(0.22, "lowpass", 1500, 180, 0.42);
    tone("sine", 240, 80, 0.18, 0.3);
  },
  coin: () => {
    tone("square", 988, 988, 0.07, 0.1);
    tone("square", 1319, 1319, 0.26, 0.1, 0.07);
  },
  chomp: (alt = false) => tone("triangle", alt ? 330 : 460, alt ? 210 : 300, 0.07, 0.22),
  power: () => tone("sawtooth", 150, 950, 0.5, 0.1),
  lose: () => tone("sawtooth", 440, 55, 0.75, 0.14),
  achievement: () => notes([659, 784, 988], 0.07, 0.16, 0.22),
  rankUp: () => notes([523, 659, 784, 1047, 1319], 0.08, 0.24, 0.26),
  win: () => notes([523, 659, 784, 1047, 784, 1047, 1319], 0.09, 0.22, 0.24),
};

export function setSound(on: boolean) {
  load();
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  if (on) sfx.pop();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useSound() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return enabled;
    },
    () => true,
  );
}
