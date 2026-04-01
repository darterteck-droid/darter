"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const capabilities = [
  "Natural language understanding",
  "Context-aware conversations",
  "Patient-friendly tone",
  "Instant scheduling and information lookups",
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DemoSection() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const bar = progressRef.current;
      if (!audio || !bar || duration === 0) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
    },
    [duration]
  );

  return (
    <SectionWrapper id="demo">
      <audio ref={audioRef} src="/demo-audio.mp3" preload="metadata" />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left: copy */}
        <AnimateOnScroll>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            A More{" "}
            <span className="bg-gradient-to-r from-accent-200 via-accent-400 to-accent-600 bg-clip-text text-transparent">
              Natural
            </span>
            <br />
            Conversation Experience
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Darter sounds warm, clear, and professional so patients never
            feel like they are speaking to a machine.
          </p>
          <ul className="mt-8 space-y-4">
            {capabilities.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 shrink-0 text-accent-400" />
                <span className="font-medium text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>

        {/* Right: demo card */}
        <AnimateOnScroll delay={0.2}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated p-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/5 px-4 py-1.5 text-sm text-accent-400">
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-accent-400 ${isPlaying ? "animate-pulse" : ""}`}
                />
                Live Demo Recording
              </span>
              <h3 className="mt-4 text-xl font-bold">Darter in Action</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Hear how Darter handles a real patient call.
              </p>
            </div>

            {/* Waveform visualizer */}
            <div className="mt-6 rounded-xl bg-surface p-6">
              <div className="flex h-16 items-end justify-center gap-[3px]">
                {Array.from({ length: 48 }).map((_, i) => {
                  const seed = Math.sin(i * 1.8 + 0.5) * 0.5 + 0.5;
                  const h = 15 + seed * 85;
                  const filled = progress > (i / 48) * 100;
                  return (
                    <div
                      key={i}
                      className={`w-[3px] rounded-full transition-colors duration-150 ${
                        filled ? "bg-accent-400" : "bg-accent-400/20"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex items-center gap-4">
              <span className="w-10 text-right text-xs tabular-nums text-text-muted">
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressRef}
                onClick={seek}
                className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-border"
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-accent-400 transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-accent-400 bg-background shadow-sm transition-[left] duration-100"
                  style={{ left: `${progress}%`, marginLeft: "-7px" }}
                />
              </div>
              <span className="w-10 text-xs tabular-nums text-text-muted">
                {duration > 0 ? formatTime(duration) : "-:--"}
              </span>
            </div>

            {/* Play button */}
            <div className="mt-6 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 text-background transition-all hover:bg-accent-300 hover:shadow-[0_0_20px_rgba(201,165,144,0.3)] active:scale-95"
              >
                {isPlaying ? (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </SectionWrapper>
  );
}
