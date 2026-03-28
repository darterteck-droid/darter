import AnimateOnScroll from "./AnimateOnScroll";

type TestimonialCardProps = {
  quote: string;
  body: string;
  name: string;
  title: string;
  delay?: number;
};

export default function TestimonialCard({
  quote,
  body,
  name,
  title,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <AnimateOnScroll delay={delay}>
      <div className="relative rounded-2xl border-l-4 border-accent-400 bg-surface p-8">
        <span className="absolute -top-4 left-4 text-7xl leading-none text-accent-400/20">
          &ldquo;
        </span>
        <p className="text-lg font-semibold text-text-primary">&ldquo;{quote}&rdquo;</p>
        <p className="mt-4 text-text-secondary leading-relaxed">{body}</p>
        <div className="mt-6">
          <p className="font-medium text-text-primary">{name}</p>
          <p className="text-sm text-text-muted">{title}</p>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
