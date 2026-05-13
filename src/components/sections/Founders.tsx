import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

export default function Founders() {
  return (
    <SectionWrapper id="founders" className="bg-surface">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <AnimateOnScroll>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-3xl bg-accent-200/40 blur-2xl" />
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-border bg-surface-sunken shadow-[0_24px_60px_-30px_rgba(26,22,19,0.25)]">
                <Image
                  src="/founders.jpg"
                  alt="David and Carter, co-founders of Darter"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Story */}
          <AnimateOnScroll delay={0.15}>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              The Founders
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                We started Darter to build native mobile apps for the
                world&apos;s leading aesthetic practices. Hand-built,
                under your name, never ours. No templates, no white-label
                shells.
              </p>
              <p>
                An app brings your brand right onto your clients&apos;
                phones. A note when something opens. A reason to come
                back. More rebooks, more referrals, and a clientele that
                feels even closer to the brand they already love.
              </p>
              <p>That&apos;s why we built Darter.</p>
              <p className="text-base text-text-muted">
                David &amp; Carter
              </p>
            </div>
            <div className="mt-8 h-px bg-gradient-to-r from-accent-400/40 to-transparent" />
          </AnimateOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
