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
                We talked to a lot of aesthetic practices, and the same
                thing kept coming up. Great clients. Beautiful spaces. A
                real waiting list. But the moment a patient walked out,
                the relationship basically went silent until the next
                visit. A mobile app fixes that.
              </p>
              <p>
                Your practice lives right on their phone. They get a
                heads-up when something opens up, a note from you, a
                reason to come back. They feel taken care of, and you see
                it in more rebooks, more referrals, and a clientele that
                actually feels connected to your brand.
              </p>
              <p>
                That&apos;s why we built Darter. To help the best
                practices stay close to the people they take care of.
              </p>
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
