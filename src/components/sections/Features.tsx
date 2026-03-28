import SectionWrapper from "@/components/ui/SectionWrapper";
import FeatureCard from "@/components/ui/FeatureCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <SectionWrapper id="features">
      <AnimateOnScroll>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Comprehensive Voice AI for Aesthetic Clinics
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Powerful automation tools tailored to your practice needs.
            Darter gives you the software, training, and support to scale.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
        ))}
      </div>
    </SectionWrapper>
  );
}
