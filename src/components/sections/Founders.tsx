import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

export default function Founders() {
  return (
    <SectionWrapper id="founders" className="bg-surface">
      <AnimateOnScroll>
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Built for the Reality of a Busy Clinic
          </h2>
        </div>
      </AnimateOnScroll>
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
                We started Darter after seeing the same problem in clinic after
                clinic: front-desk teams pulled in too many directions at once.
                The phone rings, something has to wait.
              </p>
              <p>
                We built Darter so your team stays focused on the patient in
                front of them, while every call is still answered with speed
                and professionalism.
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
