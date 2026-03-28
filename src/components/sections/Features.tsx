import SectionWrapper from "@/components/ui/SectionWrapper";
import FeatureCard from "@/components/ui/FeatureCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <SectionWrapper id="features" className="bg-surface">
      <AnimateOnScroll>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Everything Your Front Desk Should Be
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Darter handles the calls so your team can focus on patients.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
        ))}
      </div>
    </SectionWrapper>
  );
}
