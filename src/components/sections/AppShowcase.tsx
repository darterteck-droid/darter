"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import PhoneFrame from "@/components/ui/PhoneFrame";
import { SHOWCASE_SCREENS } from "@/lib/constants";

// Skip the first screen — it's already featured in the Hero.
const screens = SHOWCASE_SCREENS.slice(1);

function Header() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
        The Work
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
        A patient experience worthy of your name.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
        Every screen considered. A few moments from a recent build for
        Beauty Co.
      </p>
    </div>
  );
}

/**
 * Card — each card listens to the section's scrollYProgress and animates
 * its own scale / opacity / lift in a triangular envelope around its
 * "center moment." The card is fully present (scale 1, opaque) when the
 * row brings it under the viewport center, and softly recedes on either
 * side. Three cards are visible at any moment: a focused center and two
 * dimmed shoulders.
 *
 * useTransform must be called unconditionally per render, so each card is
 * its own component — that keeps the hook count stable across renders.
 */
function Card({
  screen,
  index,
  count,
  progress,
}: {
  screen: (typeof screens)[number];
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  // The card is "centered" when the row has translated to bring it under
  // the viewport center. With leading/trailing padding sized so the first
  // and last cards land centered at progress 0 and 1, the center moment
  // for card i is simply i / (count - 1).
  const segment = 1 / Math.max(1, count - 1);
  const center = index * segment;

  const scale = useTransform(
    progress,
    [center - segment, center, center + segment],
    [0.72, 1, 0.72],
  );
  const opacity = useTransform(
    progress,
    [center - segment, center, center + segment],
    [0.28, 1, 0.28],
  );
  const y = useTransform(
    progress,
    [center - segment, center, center + segment],
    [24, 0, 24],
  );

  return (
    <motion.div
      style={{ scale, opacity, y }}
      className="shrink-0 w-[200px] md:w-[220px] lg:w-[260px]"
    >
      <div className="flex flex-col items-center text-center">
        <PhoneFrame
          src={screen.src}
          alt={screen.alt}
          widthClassName="w-full"
        />
        <p className="mt-6 max-w-[220px] text-sm leading-relaxed text-text-secondary lg:text-base">
          {screen.caption}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * DesktopPinnedScroll — the section pins to the viewport while the
 * caller scrolls down, and that vertical scroll drives the horizontal
 * travel of the phone row. The row begins with the first card centered
 * under the viewport; as the user scrolls, the row slides left and each
 * card rises into focus and falls away on either side.
 *
 * The outer section height is sized to (viewport + horizontal travel +
 * generous breathing room), so the sticky child has enough runway to
 * translate end-to-end at a slow, deliberate pace.
 */
function DesktopPinnedScroll() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      // Translate exactly far enough to bring the last card to the
      // viewport center. With symmetric lead/trail padding, that
      // distance is the overflow beyond the viewport width.
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  // Vertical runway: viewport height plus the horizontal travel plus an
  // extra 80vh per additional card. The extra slows the effect down so
  // each card has time to make an entrance.
  const extraRunway = (screens.length - 1) * 0.8;

  return (
    <section
      ref={targetRef}
      aria-label="App showcase"
      className="relative hidden bg-background md:block"
      style={{
        height: `calc(${100 + extraRunway * 100}vh + ${distance}px)`,
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Header />

        <div className="mt-16 overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex items-center gap-12 will-change-transform lg:gap-16"
          >
            {/* Leading spacer: half the viewport minus half a card so the
                first card lands centered at progress 0. */}
            <div
              aria-hidden
              className="shrink-0 w-[calc(50vw-100px)] md:w-[calc(50vw-110px)] lg:w-[calc(50vw-130px)]"
            />
            {screens.map((screen, i) => (
              <Card
                key={screen.src}
                screen={screen}
                index={i}
                count={screens.length}
                progress={scrollYProgress}
              />
            ))}
            {/* Trailing spacer: mirror of the leading spacer so the last
                card lands centered at progress 1. */}
            <div
              aria-hidden
              className="shrink-0 w-[calc(50vw-100px)] md:w-[calc(50vw-110px)] lg:w-[calc(50vw-130px)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * MobileSwipeScroll — touch devices keep the original swipeable snap row.
 * Pinned vertical-to-horizontal scroll fights with native touch scroll on
 * mobile, so the gesture model stays native there.
 */
function MobileSwipeScroll() {
  return (
    <section aria-label="App showcase" className="bg-background py-16 md:hidden">
      <AnimateOnScroll>
        <Header />
      </AnimateOnScroll>

      <div className="relative mt-12">
        <div className="-mx-4 overflow-x-auto px-4 pb-6 [scrollbar-width:thin]">
          <ul className="flex snap-x snap-mandatory gap-6">
            {screens.map((screen, i) => (
              <li
                key={screen.src}
                className="snap-center shrink-0 w-[68vw] max-w-[260px]"
              >
                <AnimateOnScroll delay={i * 0.08}>
                  <div className="flex flex-col items-center text-center">
                    <PhoneFrame
                      src={screen.src}
                      alt={screen.alt}
                      widthClassName="w-full"
                    />
                    <p className="mt-6 max-w-xs text-sm leading-relaxed text-text-secondary">
                      {screen.caption}
                    </p>
                  </div>
                </AnimateOnScroll>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-text-muted">
          Swipe
        </p>
      </div>
    </section>
  );
}

export default function AppShowcase() {
  // Wrapper carries the #showcase anchor so nav links work at every
  // breakpoint; only the breakpoint-appropriate variant is visible.
  return (
    <div id="showcase">
      <DesktopPinnedScroll />
      <MobileSwipeScroll />
    </div>
  );
}
