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
      <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/30">
        {/* Corner glow on hover */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-accent-400/0 blur-[50px] transition-all duration-500 group-hover:bg-accent-400/10" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/10 transition-colors duration-300 group-hover:bg-accent-400/15">
          <Icon className="h-6 w-6 text-accent-400" />
        </div>
        <h3 className="relative mt-4 text-lg font-semibold text-text-primary">{title}</h3>
        <p className="relative mt-2 text-text-secondary leading-relaxed">{description}</p>
      </div>
    </AnimateOnScroll>
  );
}
