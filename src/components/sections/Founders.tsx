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
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-accent-200/40 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-sunken shadow-[0_24px_60px_-30px_rgba(26,22,19,0.25)]">
                <Image
                  src="/founders.jpg"
                  alt="David and Carter, co-founders of Darter, working in the studio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Story */}
          <AnimateOnScroll delay={0.15}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
              The Founders
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Builders, by trade.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                Darter began in voice AI for aesthetic practices. Time in the
                field reset our thinking. The finest practices already answer
                the phone; what they were missing — what their patients kept
                asking for — was a way to live inside the relationship
                between visits.
              </p>
              <p>
                So we narrowed the work. Today, Darter hand-builds native iOS
                and Android apps for a small number of practices each quarter.
                No templates. No white-label shells. Each one ships under your
                name, with the booking, push, membership, and referral
                machinery quietly attended to.
              </p>
              <p className="text-base text-text-muted">
                — David &amp; Carter
              </p>
            </div>
            <div className="mt-8 h-px bg-gradient-to-r from-accent-400/40 to-transparent" />
          </AnimateOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
