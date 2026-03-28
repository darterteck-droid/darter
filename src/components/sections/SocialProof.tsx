import SectionWrapper from "@/components/ui/SectionWrapper";
import TestimonialCard from "@/components/ui/TestimonialCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { TESTIMONIALS } from "@/lib/constants";

export default function SocialProof() {
  return (
    <SectionWrapper id="testimonials">
      <AnimateOnScroll>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Trusted by Leading Aesthetic Clinics
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            See why clinics across the country are switching to Darter.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial, i) => (
          <TestimonialCard
            key={testimonial.name}
            {...testimonial}
            delay={i * 0.15}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
