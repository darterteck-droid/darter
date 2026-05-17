import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Button from "@/components/ui/Button";
import { DEMO_URL } from "@/lib/constants";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Soft cream wash with a tan radial accent. Matches the calm tone of the Apple-product-page hero. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-surface-sunken to-background" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <AnimateOnScroll>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
            Begin
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Ready when{" "}
            <span className="inline-block bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 bg-clip-text pb-1 leading-[1.15] text-transparent">
              your practice is.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            Two to four weeks from kickoff to live in both stores. Built by
            hand, for one practice at a time.
          </p>
          <div className="mt-10 flex flex-col items-center gap-6">
            <Button href={DEMO_URL} size="lg">
              Book a 30-min Call &rarr;
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
