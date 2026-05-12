"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import PhoneFrame from "@/components/ui/PhoneFrame";
import StoreBadges from "@/components/ui/StoreBadges";
import { DEMO_URL, SHOWCASE_SCREENS } from "@/lib/constants";

const heroScreen = SHOWCASE_SCREENS[0];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft cream background with a tan radial accent glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-surface-sunken" />
        <div className="absolute left-1/2 top-[28%] -z-10 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-200/40 blur-3xl" />
        <div className="absolute right-[-10%] top-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-accent-100/60 blur-3xl" />
      </div>

      <div className="relative z-10 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-300/60 bg-white/70 px-4 py-1.5 text-sm text-accent-600 backdrop-blur-sm shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                Custom-Built Apps for MedSpas
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              Your practice. In their pocket.
              <span className="mt-2 block bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 bg-clip-text text-transparent">
                Native iOS &amp; Android apps, built for you.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              Darter designs and builds branded mobile apps for high-end
              aesthetic practices. Push to your patients, take bookings around
              the clock, and grow loyalty — all in an app that lives on their
              home screen under your name.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              <Button href={DEMO_URL} size="lg">
                Book a Demo &rarr;
              </Button>
              <Button href="#showcase" variant="ghost" size="lg">
                See the App
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.4 }}
            >
              <StoreBadges variant="hero" />
            </motion.div>
          </div>

          {/* Hero phone */}
          <motion.div
            className="relative mt-16 flex justify-center lg:mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <PhoneFrame
                src={heroScreen.src}
                alt={heroScreen.alt}
                widthClassName="w-[260px] sm:w-[300px] lg:w-[340px]"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
