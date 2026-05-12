import { type LucideIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <AnimateOnScroll delay={delay} className="h-full">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(26,22,19,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/60 hover:shadow-[0_12px_36px_-12px_rgba(26,22,19,0.14)]">
        {/* Corner glow on hover */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-accent-300/0 blur-[50px] transition-all duration-500 group-hover:bg-accent-300/40" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 transition-colors duration-300 group-hover:bg-accent-200/80">
          <Icon className="h-6 w-6 text-accent-600" />
        </div>
        <h3 className="relative mt-4 text-lg font-semibold text-text-primary">
          {title}
        </h3>
        <p className="relative mt-2 text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </AnimateOnScroll>
  );
}
