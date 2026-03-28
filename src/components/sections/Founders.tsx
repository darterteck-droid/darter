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
              {/* Glow behind photo */}
              <div className="absolute -inset-4 rounded-3xl bg-accent-400/5 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface-elevated">
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
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
              Meet the Founders
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              David &amp; Carter
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-text-secondary">
              <p>
                We started Darter because we saw the same problem in practice
                after practice: front desk staff stretched impossibly thin.
                They&apos;re checking in patients, handling paperwork, answering
                questions, and every time the phone rings, something has to
                give.
              </p>
              <p>
                The reality is that half of those calls are spam, reschedules,
                or simple questions that don&apos;t need a human touch. But your
                team doesn&apos;t know that until they pick up, and by then,
                the patient standing right in front of them has been put on
                hold.
              </p>
              <p>
                We built Darter so your staff can put their full attention where
                it matters most: the people in the room. Every call still gets
                answered. Every appointment still gets booked. But now your team
                is free to do what they do best: deliver an experience that
                keeps patients coming back.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-accent-400/30 to-transparent" />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}
