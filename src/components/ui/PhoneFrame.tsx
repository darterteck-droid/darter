import Image from "next/image";

type PhoneFrameProps = {
  src: string;
  alt: string;
  /** Tailwind width utility for the outer frame, e.g. "w-[280px]" or "w-full". */
  widthClassName?: string;
  /** Apply LCP-friendly priority for the hero phone. */
  priority?: boolean;
  className?: string;
};

/**
 * PhoneFrame: pure CSS iPhone-style bezel. Wraps a screen capture in a
 * rounded device shell with a Dynamic Island notch. Sized via a Tailwind width
 * utility so the same component works in the Hero (large) and AppShowcase
 * (small) without conditional logic.
 */
export default function PhoneFrame({
  src,
  alt,
  widthClassName = "w-[280px]",
  priority = false,
  className = "",
}: PhoneFrameProps) {
  return (
    <div
      className={`relative ${widthClassName} ${className}`}
      style={{ filter: "drop-shadow(0 30px 60px rgba(26,22,19,0.18))" }}
    >
      {/* Device chassis */}
      <div className="relative rounded-[2.6rem] bg-neutral-900 p-[8px] ring-1 ring-black/10 sm:rounded-[3rem] sm:p-[10px]">
        {/* Inner screen */}
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2rem] bg-white sm:rounded-[2.4rem]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 70vw, 320px"
            className="object-cover"
          />
          {/* Dynamic Island */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-2 h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-black sm:top-3 sm:h-[26px] sm:w-[96px]"
          />
        </div>
      </div>
    </div>
  );
}
