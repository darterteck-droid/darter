"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SUBTITLES } from "@/lib/content";
import { useIntroDone } from "@/lib/intro";

// Captions along the bottom, like the film has subtitles on. One line per section.
export default function Subtitles() {
  const ready = useIntroDone();
  const [current, setCurrent] = useState<string | null>("top");

  useEffect(() => {
    const ids = Object.keys(SUBTITLES);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    // Whichever section crosses the middle of the screen owns the caption.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const line = current ? SUBTITLES[current] : null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-3 z-[80] flex justify-center px-6 sm:bottom-5">
      <AnimatePresence mode="wait">
        {ready && line && (
          <motion.p
            key={line}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="max-w-xl text-center text-[13px] font-medium leading-relaxed sm:text-[15px]"
          >
            <span className="subtitle rounded px-2 py-0.5">{line}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
