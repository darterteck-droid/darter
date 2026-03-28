"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import { DEMO_URL } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Layered glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[800px] rounded-full bg-accent-400/8 blur-[150px]" />
      </div>
      <div className="pointer-events-none absolute -left-40 top-1/2">
        <div className="h-[300px] w-[300px] rounded-full bg-accent-500/5 blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute -right-40 top-1/3">
        <div className="h-[250px] w-[250px] rounded-full bg-accent-300/4 blur-[80px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,165,144,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,144,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top fade to hide grid edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-accent-400/30 bg-accent-400/5 px-4 py-1.5 text-sm text-accent-400">
            AI-Powered Receptionist
          </span>
        </motion.div>

        <motion.h1
          className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Never Miss
          <br />
          <span className="bg-gradient-to-r from-accent-200 via-accent-400 to-accent-600 bg-clip-text text-transparent">
            Another Call.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Darter is the 24/7 AI receptionist built for aesthetic clinics. Every
          call answered. Every appointment booked. Every dollar captured.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Button href={DEMO_URL} size="lg">
            Book a Demo
          </Button>
          <Button href="#how-it-works" variant="ghost" size="lg">
            See How It Works
          </Button>
        </motion.div>

        {/* Trusted by line */}
        <motion.p
          className="mt-16 text-xs uppercase tracking-[0.2em] text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Trusted by 50+ aesthetic clinics nationwide
        </motion.p>
      </div>
    </section>
  );
}
