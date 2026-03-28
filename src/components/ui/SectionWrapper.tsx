type SectionWrapperProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export default function SectionWrapper({
  id,
  className = "",
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className={`py-16 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
