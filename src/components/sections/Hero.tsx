"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import { DEMO_URL } from "@/lib/constants";
import DashboardMockup from "@/components/sections/DashboardMockup";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background video - only behind hero text area */}
      <div className="absolute inset-x-0 top-0 h-[100vh] z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/5 px-4 py-1.5 text-sm text-accent-400 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                Voice AI for Aesthetic Clinics
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              The AI Receptionist Built for{" "}
              <span className="bg-gradient-to-r from-accent-200 via-accent-400 to-accent-600 bg-clip-text text-transparent">
                Growing Aesthetic Practices
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Darter answers every call, books appointments, and helps your
              clinic capture revenue that would otherwise slip away. Day or
              night.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Button href={DEMO_URL} size="lg">
                Book a Demo &rarr;
              </Button>
              <Button href="#demo" variant="ghost" size="lg">
                Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Dashboard mockup */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
