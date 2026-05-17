"use client";

import { useEffect, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { TrendingUp, BadgeDollarSign } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import Button from "@/components/ui/Button";
import { APP_VALUE_DEFAULTS, DEMO_URL } from "@/lib/constants";

const D = APP_VALUE_DEFAULTS;

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/**
 * AnimatedMoney: tweens the displayed number toward `value` whenever it
 * changes. Gives the calculator a "smooth" feel instead of a jumpy
 * recalculation every slider tick.
 */
function AnimatedMoney({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (latest) => formatMoney(latest));
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span className="tabular-nums">{display}</motion.span>;
}

function Slider({
  label,
  prefix = "",
  suffix = "",
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        <span className="text-sm font-semibold text-accent-600 tabular-nums">
          {prefix}
          {value.toLocaleString("en-US")}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="app-calc-slider mt-3 w-full"
        aria-label={label}
      />
      <div className="mt-1 flex justify-between text-xs text-text-muted tabular-nums">
        <span>
          {prefix}
          {min.toLocaleString("en-US")}
          {suffix}
        </span>
        <span>
          {prefix}
          {max.toLocaleString("en-US")}
          {suffix}
        </span>
      </div>
    </div>
  );
}

export default function AppValueCalculator() {
  const [avgTicket, setAvgTicket] = useState(D.avgTicket);
  const [activePatients, setActivePatients] = useState(D.activePatients);
  const [rebookRate, setRebookRate] = useState(D.currentRebookRate);

  const { monthlyLift, valuationLift } = useMemo(() => {
    const today =
      activePatients * D.monthlyVisitsPerActive * (rebookRate / 100) * avgTicket;
    const withApp =
      activePatients *
      (1 + D.referralLift) *
      D.monthlyVisitsPerActive *
      ((rebookRate + D.rebookLiftPoints) / 100) *
      (avgTicket * (1 + D.ticketLift));
    const monthly = Math.max(0, withApp - today);
    const annual = monthly * 12;
    return {
      monthlyLift: monthly,
      valuationLift: annual * D.valuationMultiple,
    };
  }, [avgTicket, activePatients, rebookRate]);

  return (
    <SectionWrapper id="value" className="bg-background">
      <AnimateOnScroll>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
            The Math
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Three numbers. The new revenue an app unlocks.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            A conservative read of monthly revenue lift and the extra
            valuation it creates. Grounded in published benchmarks for
            push engagement, loyalty spend, and aesthetic rebooking.
          </p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={0.1}>
        <div className="mx-auto mt-14 grid max-w-5xl gap-10 rounded-3xl border border-border bg-surface p-8 shadow-[0_24px_60px_-30px_rgba(26,22,19,0.18)] sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12">
          {/* Inputs */}
          <div className="space-y-8">
            <Slider
              label="Average ticket"
              prefix="$"
              min={D.avgTicketMin}
              max={D.avgTicketMax}
              step={25}
              value={avgTicket}
              onChange={setAvgTicket}
            />
            <Slider
              label="Active patients (last 12 months)"
              min={D.activePatientsMin}
              max={D.activePatientsMax}
              step={50}
              value={activePatients}
              onChange={setActivePatients}
            />
            <Slider
              label="Current 90-day rebook rate"
              suffix="%"
              min={D.currentRebookRateMin}
              max={D.currentRebookRateMax}
              step={1}
              value={rebookRate}
              onChange={setRebookRate}
            />
          </div>

          {/* Outputs */}
          <div className="flex flex-col justify-center gap-6 rounded-2xl bg-surface-sunken p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-text-secondary">
                <TrendingUp className="h-4 w-4 text-accent-600" />
                <p className="text-sm font-medium uppercase tracking-wider">
                  Monthly revenue lift
                </p>
              </div>
              <p className="mt-3 bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl tabular-nums">
                +<AnimatedMoney value={monthlyLift} />
                <span className="ml-1 text-lg font-medium text-text-muted">
                  / month
                </span>
              </p>
            </div>
            <div className="h-px bg-border" />
            <div>
              <div className="flex items-center gap-2 text-text-secondary">
                <BadgeDollarSign className="h-4 w-4 text-accent-600" />
                <p className="text-sm font-medium uppercase tracking-wider">
                  Practice valuation lift
                </p>
              </div>
              <p className="mt-3 bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl tabular-nums">
                +<AnimatedMoney value={valuationLift} />
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Illustrative {D.valuationMultiple}× multiple on annualized
                recurring revenue lift.
              </p>
            </div>
            <div className="mt-2">
              <Button
                href={DEMO_URL}
                variant="primary"
                className="w-full justify-center"
              >
                Book a 30-min Call
              </Button>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-text-muted">
        Lift estimates use a +{D.rebookLiftPoints}pp rebook lift from push and
        in-app booking (midpoint of Airship and Localytics retail-app
        benchmarks), +{Math.round(D.ticketLift * 100)}% ticket lift from
        loyalty and upsell (a conservative read of Bond Brand Loyalty
        engaged-member spend), and +{Math.round(D.referralLift * 100)}%
        annual active-patient growth through in-app referral. Results vary.
        We&apos;ll prepare a tailored projection for your practice on the call.
      </p>
    </SectionWrapper>
  );
}
