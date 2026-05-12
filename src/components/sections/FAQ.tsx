"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { DEMO_URL } from "@/lib/constants";

const faqs = [
  {
    question: "Is this a template, or a real native app?",
    answer:
      "A real native app — built per practice, published in the App Store and Google Play under your brand. Not a PWA, not a wrapper, not a multi-tenant 'select your practice' setup. Your patients tap your icon, see your name, and never know Darter exists.",
  },
  {
    question: "How long does it take to launch?",
    answer:
      "Most builds run 6–10 weeks from kickoff, including App Store and Google Play review. We don't sell speed — we sell craft. The result is an app you'd actually want representing your brand on a patient's home screen.",
  },
  {
    question: "Will my patients actually download it?",
    answer:
      "Yes, when the value is real. We design every launch around push, loyalty, and exclusive offers that give patients a concrete reason to install — and to keep coming back. Practices with engaged patient bases routinely see 40–60% of active patients install within the first 90 days.",
  },
  {
    question:
      "How does this work with Boulevard, Mangomint, Zenoti, or my current PMS?",
    answer:
      "We sit on top of your existing platform. Bookings made in the app sync back to your system of record, so your front-desk workflow doesn't change. We're the patient-facing layer — not a replacement for the platform you already trust to run the business.",
  },
  {
    question: "What does ongoing maintenance cover?",
    answer:
      "iOS and Android OS updates, App Store and Play Store compliance, security patches, feature improvements, push campaign tools, and analytics. You're not buying a one-time deliverable — you're buying a partner who keeps the app working as the platforms evolve.",
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
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Answers to the questions every founder asks us.
          </h2>
          <p className="mt-4 text-text-secondary">
            What we build, how long it takes, and how it fits with the
            platform you already use.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-[0_8px_24px_-12px_rgba(26,22,19,0.12)]">
            <p className="text-lg font-semibold text-accent-600">
              Still have questions?
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              We&apos;ll walk through your practice, your patients, and the
              shape of the app that fits.
            </p>
            <Link
              href={DEMO_URL}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-600 transition-colors hover:text-accent-500"
            >
              Book a Demo
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
