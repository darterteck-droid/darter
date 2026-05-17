"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { DEMO_URL } from "@/lib/constants";

const faqs = [
  {
    question: "Is this a template, or a true native app?",
    answer:
      "A true native app, built from scratch for your practice and published in the App Store and Google Play under your name. Not a PWA, not a wrapper, not a 'select your location' shell. Your patients tap your icon, see your name, and never know Darter exists.",
  },
  {
    question: "What is the timeline?",
    answer:
      "Six to ten weeks from kickoff to a live app in both stores, store reviews included. We don't sell speed. We sell craft. The result is an app worth carrying your name on a patient's home screen.",
  },
  {
    question: "Will my patients actually use it?",
    answer:
      "Yes, when the experience is worth using. Every launch is built around membership, direct messaging, and members-only releases. Concrete reasons to install, and concrete reasons to come back. Practices with a strong patient base regularly see 40 to 60% of active patients install in the first ninety days.",
  },
  {
    question:
      "How does it work with Boulevard, Mangomint, Zenoti, or our current PMS?",
    answer:
      "Darter sits alongside the platform you already trust. Reservations made in the app sync back to your system of record. The front-desk routine doesn't change. We are the patient-facing layer, not a replacement for the system that runs the house.",
  },
  {
    question: "What does ongoing stewardship cover?",
    answer:
      "iOS and Android OS releases, App Store and Play Store compliance, security, feature refinements, push tooling, and analytics. You aren't buying a deliverable. You're retaining a partner who keeps the app at the standard your brand requires, year after year.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionWrapper id="faq" className="bg-surface-sunken">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        {/* Left */}
        <AnimateOnScroll>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
            Questions
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            The questions clinic owners ask first.
          </h2>
          <p className="mt-4 text-text-secondary">
            What we build, how it ships, and where it sits alongside the
            systems your practice already runs on.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-[0_8px_24px_-12px_rgba(26,22,19,0.12)]">
            <p className="text-lg font-semibold text-accent-600">
              Got a question that isn&apos;t here?
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Thirty minutes on the phone with us. Your practice, your
              patients, and the shape of the app that fits.
            </p>
            <Link
              href={DEMO_URL}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-600 transition-colors hover:text-accent-500"
            >
              Book a Call
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Right: Accordion */}
        <AnimateOnScroll delay={0.15}>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  openIndex === i
                    ? "border-accent-400/60 bg-surface"
                    : "border-border bg-surface/70 hover:bg-surface"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="pr-4 font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  {openIndex === i ? (
                    <Minus className="h-5 w-5 shrink-0 text-accent-600" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-text-muted" />
                  )}
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-5">
                    <p className="text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </SectionWrapper>
  );
}
