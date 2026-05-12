import Link from "next/link";
import { STORE_LINKS } from "@/lib/constants";

/*
 * Apple and Google badge usage:
 *   - SVGs are the official artwork (Apple: developer.apple.com badge generator;
 *     Google Play: official badge SVG). Do not recolor, rotate, animate, or modify.
 *   - Maintain proportional clear space around each badge.
 *   - Both badges should render at the same visual height.
 *   - Apple requires the badge to render at least 40px tall.
 */

type Variant = "hero" | "cta" | "footer";

const heights: Record<Variant, string> = {
  hero: "h-12 sm:h-14",
  cta: "h-11 sm:h-12",
  footer: "h-10",
};

const wrapperJustify: Record<Variant, string> = {
  hero: "justify-center",
  cta: "justify-center",
  footer: "justify-center sm:justify-start",
};

type Props = {
  variant?: Variant;
  showLabel?: boolean;
  className?: string;
};

export default function StoreBadges({
  variant = "hero",
  showLabel = true,
  className = "",
}: Props) {
  const heightClass = heights[variant];
  const isExternal = (href: string) => /^https?:/i.test(href);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {showLabel && (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
          Available on
        </p>
      )}
      <div className={`flex flex-wrap items-center gap-3 sm:gap-4 ${wrapperJustify[variant]}`}>
        <Link
          href={STORE_LINKS.appStore}
          aria-label="Download on the App Store"
          {...(isExternal(STORE_LINKS.appStore)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="inline-flex transition-opacity hover:opacity-85"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/badges/app-store.svg"
            alt="Download on the App Store"
            className={`${heightClass} w-auto`}
          />
        </Link>
        <Link
          href={STORE_LINKS.googlePlay}
          aria-label="Get it on Google Play"
          {...(isExternal(STORE_LINKS.googlePlay)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="inline-flex transition-opacity hover:opacity-85"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/badges/google-play.svg"
            alt="Get it on Google Play"
            className={`${heightClass} w-auto`}
          />
        </Link>
      </div>
    </div>
  );
}
