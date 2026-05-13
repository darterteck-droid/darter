import { Check } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Button from "@/components/ui/Button";
import { DEMO_URL } from "@/lib/constants";

const INCLUDED = [
  "A bespoke design system, composed around your house",
  "Native iOS and Android, hand-coded — never a template",
  "Submission to the App Store and Google Play, under our developer accounts",
  "Push infrastructure, with quiet, practice-side controls",
  "Membership, recognition, and a built-in referral programme",
  "Reservation sync with the PMS your practice already runs on",
  "Ongoing OS, security, and refinement releases",
  "White-glove launch, team training, and a patient activation playbook",
];

export default function Pricing() {
  return (
    <SectionWrapper id="pricing" className="bg-background">
      <AnimateOnScroll>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
            Engagement
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            A single, considered engagement.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            A one-time build. Ongoing stewardship. Both calibrated to the
            scale of your practice and the standard it requires.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={0.15}>
        <div className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-[0_30px_80px_-30px_rgba(26,22,19,0.22)] sm:p-12">
          {/* Soft tan glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full bg-accent-200/40 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
                The Darter Build
              </p>
              <h3 className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
                One engagement. One app. One partner.
              </h3>
              <p className="mt-3 max-w-xl text-text-secondary">
                Every Darter build includes the work below. Pricing reflects
                the scale of your practice and any bespoke work composed on
                top.
              </p>
            </div>

            <ul className="mx-auto mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-text-secondary leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-3">
              <Button href={DEMO_URL} size="lg">
                Request an Introduction
              </Button>
              <p className="text-xs text-text-muted">
                A thirty-minute conversation. No obligation. A tailored
                proposal follows within forty-eight hours.
              </p>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </SectionWrapper>
  );
}
