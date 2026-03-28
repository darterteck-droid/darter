import SectionWrapper from "@/components/ui/SectionWrapper";
import StepCard from "@/components/ui/StepCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { STEPS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <AnimateOnScroll>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            Simple Setup
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            How Darter Works
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Three simple steps to never miss a patient call again.
          </p>
        </div>
      </AnimateOnScroll>

      {/* Connecting line on desktop */}
      <div className="relative mt-16">
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-accent-400/20 to-transparent lg:block" />
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={i + 1} {...step} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
