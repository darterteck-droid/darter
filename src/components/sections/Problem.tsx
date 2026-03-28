import SectionWrapper from "@/components/ui/SectionWrapper";
import StatCard from "@/components/ui/StatCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { STATS } from "@/lib/constants";

export default function Problem() {
  return (
    <SectionWrapper className="bg-surface">
      <AnimateOnScroll>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            The Problem
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Your Front Desk Is Costing You More Than You Think
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Aesthetic clinics lose thousands every month from calls that simply
            go unanswered.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((item, i) => (
          <StatCard key={item.stat} {...item} delay={i * 0.15} />
        ))}
      </div>
    </SectionWrapper>
  );
}
