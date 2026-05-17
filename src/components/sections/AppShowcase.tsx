"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import PhoneFrame from "@/components/ui/PhoneFrame";
import { SHOWCASE_SCREENS } from "@/lib/constants";

// Skip the first screen: it's already featured in the Hero.
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
 * DesktopPinnedScroll: the section sticks to the viewport while the
 * caller scrolls down; that vertical scroll drives the phone row sideways.
 * Once the row has traveled its full distance, vertical scroll resumes.
 *
 * The outer section is sized to (viewport height + horizontal travel) so
 * the sticky child has exactly enough scroll runway to translate the row
 * end-to-end, regardless of how wide the row turns out to be.
 */
function DesktopPinnedScroll() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      // Translate just enough that the last card's right edge lines up
      // with the viewport's right edge. The leading and trailing padding
      // on the track give the row breathing room at start and finish.
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

  return (
    <section
      ref={targetRef}
      aria-label="App showcase"
      className="relative hidden bg-background md:block"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Header />
        <div className="mt-12 overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-10 px-[10vw] will-change-transform"
          >
            {screens.map((screen) => (
              <div
                key={screen.src}
                className="shrink-0 w-[300px] lg:w-[340px]"
              >
                <div className="flex flex-col items-center text-center">
                  <PhoneFrame
                    src={screen.src}
                    alt={screen.alt}
                    widthClassName="w-full"
                  />
                  <p className="mt-6 max-w-xs text-base leading-relaxed text-text-secondary">
                    {screen.caption}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * MobileSwipeScroll: touch devices keep the original swipeable
 * scroll-snap row. Pinned vertical-to-horizontal scroll feels janky on
 * touch because the gesture and the scroll model fight each other.
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
                className="snap-center shrink-0 w-[78vw] max-w-[300px]"
              >
                <AnimateOnScroll delay={i * 0.08}>
                  <div className="flex flex-col items-center text-center">
                    <PhoneFrame
                      src={screen.src}
                      alt={screen.alt}
                      widthClassName="w-full"
                    />
                    <p className="mt-6 max-w-xs text-base leading-relaxed text-text-secondary">
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
  // The two layouts share an anchor: the wrapper carries the id so the
  // nav link to "#showcase" works at every breakpoint, while only the
  // breakpoint-appropriate variant is visible.
  return (
    <div id="showcase">
      <DesktopPinnedScroll />
      <MobileSwipeScroll />
    </div>
  );
}
