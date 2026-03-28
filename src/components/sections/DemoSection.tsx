import { Sparkles } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const capabilities = [
  "Natural Language Understanding",
  "Contextual Awareness",
  "Emotional Intelligence",
  "Instant Scheduling & Lookups",
];

export default function DemoSection() {
  return (
    <SectionWrapper id="demo">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left: copy */}
        <AnimateOnScroll>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Experience the{" "}
            <span className="bg-gradient-to-r from-accent-200 via-accent-400 to-accent-600 bg-clip-text text-transparent">
              Natural
            </span>
            <br />
            Conversation Flow
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Our AI isn&apos;t just a chatbot with a voice. It&apos;s a
            context-aware medical assistant that understands clinical needs,
            insurance terms, and patient urgency.
          </p>
          <ul className="mt-8 space-y-4">
            {capabilities.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 shrink-0 text-accent-400" />
                <span className="font-medium text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>

        {/* Right: demo card */}
        <AnimateOnScroll delay={0.2}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated p-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/5 px-4 py-1.5 text-sm text-accent-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" />
                Live Demo Recording
              </span>
              <h3 className="mt-4 text-xl font-bold">Darter in Action</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Listen to a real conversation with our AI
              </p>
            </div>

            {/* Waveform mockup */}
            <div className="mt-6 rounded-xl bg-surface p-6">
              <div className="flex h-16 items-center justify-center gap-[3px]">
                {Array.from({ length: 40 }).map((_, i) => {
                  const height = Math.random() * 100;
                  return (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-accent-400/30"
                      style={{ height: `${Math.max(15, height)}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Playback controls */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs text-text-muted">0:00</span>
              <div className="relative h-1 flex-1 rounded-full bg-border">
                <div className="absolute left-0 top-0 h-full w-1/4 rounded-full bg-accent-400" />
                <div className="absolute left-1/4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent-400" />
              </div>
              <span className="text-xs text-text-muted">1:18</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-400 text-background transition-all hover:bg-accent-300 hover:shadow-[0_0_20px_rgba(201,165,144,0.3)]">
                <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </SectionWrapper>
  );
}
