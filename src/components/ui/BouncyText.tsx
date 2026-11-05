"use client";

import { motion } from "motion/react";

type Props = {
  text: string;
  play: boolean;
  delay?: number;
  className?: string;
  letterClassName?: string;
};

// Letters spring up one by one, then jump when you hover them.
// Entrance and hover live on separate layers so the stagger never delays the hover.
export default function BouncyText({ text, play, delay = 0, className, letterClassName }: Props) {
  const words = text.split(" ");
  let index = 0;

  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
          {[...word].map((char) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "70%", opacity: 0, rotate: 14, scale: 0.6 }}
                animate={play ? { y: "0%", opacity: 1, rotate: 0, scale: 1 } : undefined}
                transition={{ type: "spring", stiffness: 380, damping: 15, delay: delay + i * 0.045 }}
              >
                <motion.span
                  className={`pointer-events-auto inline-block ${letterClassName ?? ""}`}
                  // Offsets any looping letter animation (like the chroma sweep) so it travels as a wave.
                  style={{ animationDelay: `-${i * 0.4}s` }}
                  whileHover={{ y: "-16%", rotate: i % 2 ? 8 : -8, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 520, damping: 12 }}
                >
                  {char}
                </motion.span>
              </motion.span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block w-[0.32em]" />}
        </span>
      ))}
    </span>
  );
}
