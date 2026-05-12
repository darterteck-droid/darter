import SectionWrapper from "@/components/ui/SectionWrapper";
import FeatureCard from "@/components/ui/FeatureCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <SectionWrapper id="features" className="bg-surface-sunken">
      <AnimateOnScroll>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
            The Platform
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Everything a modern aesthetic brand needs in their patients&apos; hands.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Booking. Push. Loyalty. Referrals. The patient-facing layer your
            practice has been missing — designed and built around your brand.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} delay={i * 0.08} />
        ))}
      </div>
    </SectionWrapper>
  );
}
