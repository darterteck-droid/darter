"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { Play } from "lucide-react";
import type { Short } from "@/lib/content";
import { sfx } from "@/lib/sfx";
import { addViews } from "@/lib/views";
import { SCENES } from "./scenes";

// Each card pays out once per visit.
const watched = new Set<string>();

export default function ShortCard({ short }: { short: Short }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 260, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 260, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 55%)`;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 22);
    rx.set(-(py - 0.5) * 22);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  const onPlay = (e: React.MouseEvent<HTMLElement>) => {
    sfx.pop();
    if (watched.has(short.ep)) return;
    watched.add(short.ep);
    addViews(400, { x: e.clientX, y: e.clientY, label: "Watched" });
  };

  const Scene = SCENES[short.scene];

  return (
    <div className="shrink-0" style={{ perspective: 900 }}>
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={onPlay}
        data-cursor="Play"
        initial={{ rotate: short.tilt }}
        animate={{ rotate: short.tilt }}
        whileHover={{ rotate: 0, scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative aspect-[9/16] reel-card overflow-hidden rounded-[28px] border border-white/15 bg-ink-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        {short.video ? (
          <video
            src={short.video}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Scene />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,6,13,0.55),transparent_24%,transparent_60%,rgba(7,6,13,0.85))]" />
        <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundImage: glare }} />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-ink/60 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-paper backdrop-blur">
            Ep {short.ep}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-ink/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-pink" /> Short
          </span>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 animate-ping rounded-full bg-paper/30 opacity-0 group-hover:opacity-100" />
          <span className="relative flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 shadow-xl backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5" style={{ transform: "translateZ(40px)" }}>
          <h3 className="font-display text-xl font-black leading-tight tracking-tight sm:text-2xl">{short.title}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {short.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper/80">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
