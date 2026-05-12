import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Button from "@/components/ui/Button";
import StoreBadges from "@/components/ui/StoreBadges";
import { DEMO_URL } from "@/lib/constants";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Soft cream wash with a tan radial accent — matches the calm tone of the Apple-product-page hero. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-surface-sunken to-background" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <AnimateOnScroll>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
            Get Started
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Ready to put your practice{" "}
            <span className="bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 bg-clip-text text-transparent">
              in their pocket?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            6&ndash;10 weeks from kickoff to launch in both stores. Built by
            hand. Ready when your patients are.
          </p>
          <div className="mt-10 flex flex-col items-center gap-6">
            <Button href={DEMO_URL} size="lg">
              Book a Demo &rarr;
            </Button>
            <StoreBadges variant="cta" />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
