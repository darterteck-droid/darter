"use client";

import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { DEMO_URL } from "@/lib/constants";
import Link from "next/link";

const faqs = [
  {
    question: "How do I get started with Darter?",
    answer:
      "Once you book a demo, we'll walk you through the next steps, configure your system, connect the tools you already use, and help your team get up and running smoothly.",
  },
  {
    question: "How is Darter different from a traditional answering service?",
    answer:
      "Traditional answering services usually take messages. Darter does more. It can answer questions, book appointments, route calls intelligently, and create a more consistent patient experience without adding work to your team.",
  },
  {
    question: "Does Darter work with my current phone system?",
    answer:
      "In most cases, yes. We'll review your current setup during the demo and show you the best way to integrate Darter into your existing workflow.",
  },
  {
    question: "Can I customize how Darter responds?",
    answer:
      "Yes. Darter can be tailored to your clinic's services, tone, policies, and scheduling preferences so the experience feels aligned with your brand.",
  },
  {
    question: "What happens if Darter cannot handle a call?",
    answer:
      "When a call needs human attention, Darter can route it according to your preferred workflow so the right person takes over at the right time.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionWrapper id="faq">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        {/* Left */}
        <AnimateOnScroll>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-text-secondary">
            Everything you need to know about Darter, implementation, and
            getting started.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-surface-elevated p-6">
            <p className="text-lg font-semibold text-accent-400">
              Still have questions?
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              We&apos;ll walk through your workflow and show you how Darter
              fits into your clinic.
            </p>
            <Link
              href={DEMO_URL}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-400 transition-colors hover:text-accent-300"
            >
              Schedule a Consultation
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
                    ? "border-accent-400/30 bg-surface-elevated"
                    : "border-border bg-surface"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="pr-4 font-semibold text-text-primary">
                    {faq.question}
                  </span>
                  {openIndex === i ? (
                    <Minus className="h-5 w-5 shrink-0 text-accent-400" />
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
