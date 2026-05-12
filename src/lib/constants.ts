import {
  Smartphone,
  CalendarCheck,
  Bell,
  Sparkles,
  Heart,
  Palette,
  Compass,
  Hammer,
  Rocket,
} from "lucide-react";

export const DEMO_URL = "https://cal.com/darter-oi0epj/30min";

export const NAV_LINKS = [
  { label: "Platform", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#founders" },
];

/**
 * STORE_LINKS — until Beauty Co. apps are live in the stores, both badges point to
 * the in-page showcase anchor. Swap to real store URLs once available.
 */
export const STORE_LINKS = {
  appStore: "#showcase",
  googlePlay: "#showcase",
};

/**
 * Stats kept for inline copy use and any future "why an app" section. Not currently
 * rendered as a standalone section.
 */
export const STATS = [
  {
    stat: "73%",
    label: "of patient bookings are now made on mobile",
    detail:
      "If your booking lives only on a web page, you're losing the patients who never get past the App Store.",
  },
  {
    stat: "7x",
    label: "higher open rates for push vs. SMS",
    detail:
      "Push notifications cut through the noise. Fill a same-day cancellation in minutes.",
  },
  {
    stat: "3-5x",
    label: "valuation multiplier on engaged patient lift",
    detail:
      "When you grow recurring patient revenue, you don't just earn more — your practice is worth more.",
  },
];

export const STEPS = [
  {
    icon: Compass,
    title: "Discovery",
    description:
      "We sit down with you to map your brand, your patient journey, and the features that matter for your practice.",
  },
  {
    icon: Hammer,
    title: "Design & Build",
    description:
      "Hand-built native iOS and Android, designed around your brand. Booking, push, loyalty, referrals — all wired in.",
  },
  {
    icon: Rocket,
    title: "Launch & Maintain",
    description:
      "We ship to the App Store and Google Play under your name, then handle every OS update, store compliance change, and feature ship that follows.",
  },
];

export const FEATURES = [
  {
    icon: Smartphone,
    title: "Native iOS + Android",
    description:
      "Published under your brand in both stores. Not a template, not a web wrapper — actual native apps your patients keep on their home screen.",
  },
  {
    icon: CalendarCheck,
    title: "In-App Booking & Rescheduling",
    description:
      "Real-time availability, deposits, reminders. The booking lives in your app, not on someone else's portal.",
  },
  {
    icon: Bell,
    title: "Push Notifications & Promos",
    description:
      "Reach every patient instantly when a slot opens, a promo drops, or you need to fill the day. Open rates SMS can't touch.",
  },
  {
    icon: Sparkles,
    title: "Loyalty & Rewards",
    description:
      "Points, tiers, in-app currency. Designed around how aesthetic patients actually rebook — not retrofitted from retail.",
  },
  {
    icon: Heart,
    title: "Built-In Referrals",
    description:
      "Patients refer friends with a tap. Both sides get rewarded. Tracked, redeemable, painless.",
  },
  {
    icon: Palette,
    title: "Your Brand In Their Pocket",
    description:
      "Logo on the home screen. App icon they tap by name. Brand presence no third-party portal can give you.",
  },
];

/**
 * SHOWCASE_SCREENS — Beauty Co. app screens, cropped to clean phone screens and wrapped
 * in <PhoneFrame /> on render. The first entry is reused as the Hero phone.
 */
export const SHOWCASE_SCREENS = [
  {
    src: "/showcase/beauty-co-1-welcome.png",
    alt: "Beauty Co. app home screen welcoming Sarah with reward unlocked and Beauty Co+ membership",
    caption: "A home screen that picks up where the last visit left off.",
  },
  {
    src: "/showcase/beauty-co-2-services.png",
    alt: "Beauty Co. recommended services grid: Botox, Dermal Fillers, BeautyCo facial, HydraFacial",
    caption:
      "A curated treatment menu — your services, your photography, your brand.",
  },
  {
    src: "/showcase/beauty-co-3-rewards.png",
    alt: "Beauty Co. rewards detail screen with how-to-earn points list",
    caption:
      "Loyalty that drives real rebooking — points, perks, and clinic cash.",
  },
  {
    src: "/showcase/beauty-co-4-messages.png",
    alt: "Beauty Co. messages thread with Kelly, the practice's founder/owner",
    caption:
      "A direct line from owner to patient. Personal, on-brand, always-on.",
  },
  {
    src: "/showcase/beauty-co-5-offers.png",
    alt: "Beauty Co. offers screen with priority booking pass and discount",
    caption:
      "Time-limited offers and priority booking, delivered in one push.",
  },
  {
    src: "/showcase/beauty-co-6-profile.png",
    alt: "Beauty Co. patient profile showing visits, points, and savings",
    caption:
      "Patient identity in your brand — visits, points, savings, all on their phone.",
  },
];

/**
 * APP_VALUE_DEFAULTS — single source of truth for the AppValueCalculator math.
 * Lift assumptions are conservative midpoints of public industry benchmarks
 * (Airship push engagement; Bond Brand Loyalty engaged-member spend lift;
 * typical PE/M&A multiples on recurring-revenue lift in aesthetics).
 */
export const APP_VALUE_DEFAULTS = {
  avgTicket: 450, // $
  avgTicketMin: 100,
  avgTicketMax: 2000,

  activePatients: 800, // # in last 12 months
  activePatientsMin: 100,
  activePatientsMax: 10000,

  currentRebookRate: 35, // %
  currentRebookRateMin: 5,
  currentRebookRateMax: 80,

  monthlyVisitsPerActive: 0.6, // constant — average aesthetic-visit cadence
  rebookLiftPoints: 12,        // +12 pp from app push + in-app booking
  ticketLift: 0.08,            // +8% from loyalty/upsell prompts
  referralLift: 0.05,          // +5% new active patients/year
  valuationMultiple: 4,        // illustrative 3–5x recurring revenue multiple
};
