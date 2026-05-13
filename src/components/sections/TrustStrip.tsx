const PLATFORMS = ["Boulevard", "Mangomint", "Zenoti", "Aesthetic Record", "Vagaro"];

/**
 * TrustStrip — a single-line reassurance band that anchors the "we sit on top
 * of, not against, your booking platform" frame early on the page. Platform
 * names render as plain wordmarks to avoid third-party logo licensing.
 */
export default function TrustStrip() {
  return (
    <section
      aria-label="Designed to sit alongside the platforms you already trust"
      className="relative border-y border-border-subtle bg-surface"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Designed to sit alongside the platforms your house already runs on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-text-secondary sm:gap-x-12">
            {PLATFORMS.map((name) => (
              <span
                key={name}
                className="text-base font-medium tracking-wide sm:text-lg"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
