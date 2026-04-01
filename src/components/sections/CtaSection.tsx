import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Button from "@/components/ui/Button";
import { DEMO_URL } from "@/lib/constants";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Dramatic glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[400px] w-[600px] rounded-full bg-accent-400/8 blur-[120px]" />
      </div>

      {/* Grid pattern like hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,165,144,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,144,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <AnimateOnScroll>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
            Get Started
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Ready to Stop Losing Calls and Start{" "}
            <span className="bg-gradient-to-r from-accent-200 via-accent-400 to-accent-600 bg-clip-text text-transparent">
              Capturing More Revenue?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            Setup is fast. The impact is immediate.
          </p>
          <div className="mt-10">
            <Button href={DEMO_URL} size="lg">
              Book a Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-text-muted">
            No contracts. No setup fees. See it in action in 15 minutes.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
