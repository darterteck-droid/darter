import { Check } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Button from "@/components/ui/Button";
import { DEMO_URL } from "@/lib/constants";

const tiers = [
  {
    name: "Growth",
    price: "$349",
    unit: "/location/month",
    minutes: "2,500 minutes included",
    overage: "$0.15/min overage",
    features: [
      "Voice AI receptionist",
      "Missed-call capture",
      "Call transfers",
      "Text follow-up",
      "Custom knowledge base",
      "Analytics dashboard",
    ],
    highlighted: false,
  },
  {
    name: "Scale",
    price: "$599",
    unit: "/location/month",
    minutes: "5,000 minutes included",
    overage: "$0.12/min overage",
    features: [
      "Everything in Growth, plus:",
      "Premium voice AI receptionist",
      "Advanced workflows",
      "Premium support",
      "Deeper integrations",
    ],
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <SectionWrapper id="pricing">
      <AnimateOnScroll>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Pick the plan that fits your clinic. No contracts. No setup fees.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
        {tiers.map((tier, i) => (
          <AnimateOnScroll key={tier.name} delay={i * 0.15}>
            <div
              className={`relative flex h-full flex-col rounded-2xl border p-8 sm:p-10 ${
                tier.highlighted
                  ? "border-accent-400/40 bg-surface-elevated shadow-lg shadow-accent-400/5"
                  : "border-border bg-surface"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-400 px-4 py-1 text-xs font-semibold text-background">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-text-primary">
                {tier.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary sm:text-5xl">
                  {tier.price}
                </span>
                <span className="text-sm text-text-muted">{tier.unit}</span>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-sm font-medium text-accent-400">
                  {tier.minutes}
                </p>
                <p className="text-xs text-text-muted">{tier.overage}</p>
              </div>

              <div className="my-8 h-px bg-border" />

              <ul className="flex-1 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  href={DEMO_URL}
                  size="lg"
                  variant={tier.highlighted ? "primary" : "ghost"}
                  className="w-full justify-center"
                >
                  Book a Demo
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Enterprise */}
      <AnimateOnScroll delay={0.3}>
        <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-border bg-surface p-8 sm:p-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Enterprise
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Multi-location clinics, custom SLAs, and dedicated support.
                Let&apos;s build a plan around your practice.
              </p>
            </div>
            <Button href={DEMO_URL} variant="ghost" size="lg" className="shrink-0">
              Contact Us
            </Button>
          </div>
        </div>
      </AnimateOnScroll>
    </SectionWrapper>
  );
}
