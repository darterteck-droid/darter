import { type LucideIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

type StepCardProps = {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
};

export default function StepCard({
  step,
  icon: Icon,
  title,
  description,
  delay = 0,
}: StepCardProps) {
  return (
    <AnimateOnScroll delay={delay}>
      <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
        {/* Step number with glow */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent-400/20 blur-md" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent-400 bg-background text-accent-400">
            <span className="text-xl font-bold">{step}</span>
          </div>
        </div>
        <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/10">
          <Icon className="h-6 w-6 text-accent-400" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-text-primary">{title}</h3>
        <p className="mt-3 max-w-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </AnimateOnScroll>
  );
}
