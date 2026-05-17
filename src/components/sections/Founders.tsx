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
              Hi. We&apos;re David and Carter.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                We build the iOS and Android apps for some of the
                best-run aesthetic practices in the country. Hand-built,
                published under your name, never ours.
              </p>
              <p>
                The idea was simple. The clinics we love already have
                the brand, the patients, and the waitlist. What they
                don&apos;t have is a real home on the phone their
                patients actually live on. So we build them one.
              </p>
              <p>
                An app on the home screen quietly does the work a
                website can&apos;t. Patients rebook in two taps.
                Friends are invited with one. Your name sits next to
                Instagram and Apple Wallet, where it belongs in 2026.
              </p>
              <p className="text-base font-medium text-text-primary">
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
