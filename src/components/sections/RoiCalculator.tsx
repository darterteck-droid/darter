"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

export default function RoiCalculator() {
  const [ltv, setLtv] = useState(5000);
  const [missedCalls, setMissedCalls] = useState(44);
  const [conversionRate, setConversionRate] = useState(10);

  const salesLost = (missedCalls * conversionRate) / 100;
  const revenueLost = salesLost * ltv;

  return (
    <SectionWrapper id="roi-calculator">
      <AnimateOnScroll>
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 sm:p-10">
            {/* Decorative glow behind results */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2">
              <div className="absolute right-10 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-accent-400/5 blur-[80px]" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-widest text-accent-400">
              Calculate Your ROI
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              See What You&apos;re Losing
            </h2>

            <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Inputs */}
              <div className="space-y-8">
                {/* Customer LTV */}
                <div>
                  <label className="text-sm font-semibold text-text-primary">
                    Customer LTV ($)
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 items-center rounded-lg border border-border bg-surface px-3 py-2.5">
                      <span className="text-text-muted">$</span>
                      <input
                        type="number"
                        value={ltv}
                        onChange={(e) =>
                          setLtv(Math.max(0, Number(e.target.value)))
                        }
                        className="w-full bg-transparent pl-2 text-text-primary outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                    <button
                      onClick={() => setLtv(Math.max(0, ltv - 500))}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-accent-400 hover:text-accent-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setLtv(ltv + 500)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-accent-400 hover:text-accent-400"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Missed Calls Per Month */}
                <div>
                  <label className="text-sm font-semibold text-text-primary">
                    Missed Calls Per Month
                  </label>
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={missedCalls}
                      onChange={(e) => setMissedCalls(Number(e.target.value))}
                      className="roi-slider flex-1"
                    />
                    <input
                      type="number"
                      value={missedCalls}
                      onChange={(e) =>
                        setMissedCalls(
                          Math.max(0, Math.min(200, Number(e.target.value)))
                        )
                      }
                      className="w-20 rounded-lg border border-border bg-surface px-3 py-2.5 text-center text-text-primary outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Conversion Rate */}
                <div>
                  <label className="text-sm font-semibold text-text-primary">
                    Conversion Rate (%)
                  </label>
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={conversionRate}
                      onChange={(e) =>
                        setConversionRate(Number(e.target.value))
                      }
                      className="roi-slider flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={conversionRate}
                        onChange={(e) =>
                          setConversionRate(
                            Math.max(1, Math.min(100, Number(e.target.value)))
                          )
                        }
                        className="w-16 rounded-lg border border-border bg-surface px-3 py-2.5 text-center text-text-primary outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="text-text-muted">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="relative flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-10 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Estimated Sales Lost / Mo
                </p>
                <p className="mt-2 text-5xl font-bold text-text-primary sm:text-6xl">
                  {salesLost % 1 === 0
                    ? salesLost.toFixed(0)
                    : salesLost.toFixed(1)}
                </p>

                <div className="my-6 h-px w-16 bg-accent-400/30" />

                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Estimated Revenue Lost / Mo
                </p>
                <p className="mt-2 bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl">
                  ${revenueLost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </SectionWrapper>
  );
}
