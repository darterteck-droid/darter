import AnimateOnScroll from "./AnimateOnScroll";

type StatCardProps = {
  stat: string;
  label: string;
  detail: string;
  delay?: number;
};

export default function StatCard({ stat, label, detail, delay = 0 }: StatCardProps) {
  return (
    <AnimateOnScroll delay={delay} className="h-full">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-[0_1px_2px_rgba(26,22,19,0.04)] transition-all duration-300 hover:border-accent-400/60 hover:shadow-[0_12px_36px_-12px_rgba(26,22,19,0.14)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-300/0 blur-[60px] transition-all duration-500 group-hover:bg-accent-300/40" />
        <p className="relative text-5xl font-bold text-accent-600">{stat}</p>
        <p className="relative mt-2 text-lg font-semibold text-text-primary">
          {label}
        </p>
        <p className="relative mt-3 text-text-secondary leading-relaxed">
          {detail}
        </p>
      </div>
    </AnimateOnScroll>
  );
}
