import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import PhoneFrame from "@/components/ui/PhoneFrame";
import { SHOWCASE_SCREENS } from "@/lib/constants";

// Skip the first screen — it's already featured in the Hero.
const screens = SHOWCASE_SCREENS.slice(1);

export default function AppShowcase() {
  return (
    <SectionWrapper id="showcase" className="bg-background">
      <AnimateOnScroll>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-600">
            The Work
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            A patient experience worthy of your name.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Every screen considered. A few moments from a recent build for
            Beauty Co.
          </p>
        </div>
      </AnimateOnScroll>

      <div className="relative mt-14 lg:mt-20">
        {/* Horizontal scroll-snap row. Reads as a gallery at every width; users
            swipe (mobile) or scroll the row sideways (desktop) to see all five. */}
        <div className="-mx-4 overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:thin]">
          <ul className="flex snap-x snap-mandatory gap-6 sm:gap-8 lg:gap-10">
            {screens.map((screen, i) => (
              <li
                key={screen.src}
                className="snap-center shrink-0 w-[78vw] max-w-[300px] sm:w-[320px] lg:w-[340px]"
              >
                <AnimateOnScroll delay={i * 0.08}>
                  <div className="flex flex-col items-center text-center">
                    <PhoneFrame
                      src={screen.src}
                      alt={screen.alt}
                      widthClassName="w-full"
                    />
                    <p className="mt-6 max-w-xs text-base text-text-secondary leading-relaxed">
                      {screen.caption}
                    </p>
                  </div>
                </AnimateOnScroll>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-text-muted lg:hidden">
          Swipe
        </p>
      </div>
    </SectionWrapper>
  );
}
