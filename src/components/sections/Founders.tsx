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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
              The Founders
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              A relationship worth more than the booking.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                We started Darter after noticing the same gap in every
                practice we admired. They had the rooms, the clientele, the
                taste, the waiting list — and then a patient walked out, and
                the relationship effectively paused until the next
                appointment on the calendar.
              </p>
              <p>
                A mobile app changes that. Your house on the home screen of
                the people who already love it. A discreet note the moment
                something opens. A standing record of every visit. A reason
                to come back, kept in the place they spend their day.
              </p>
              <p>
                The numbers follow — higher rebooks, higher tickets, real
                referral — but the part worth building is what it does to
                the patient. They feel known. The practice gets to be
                present between visits, the way only the very best brands
                manage to be.
              </p>
              <p>
                We built Darter to look and feel the way those practices
                look and feel. Hand-built. One at a time. Composed, not
                assembled.
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
