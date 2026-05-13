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
  { label: "The Work", href: "#showcase" },
  { label: "Engagement", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Founders", href: "#founders" },
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
    label: "of patient bookings now happen on mobile",
    detail:
      "A web page is no longer where the relationship lives.",
  },
  {
    stat: "7x",
    label: "higher open rates on push than SMS",
    detail:
      "A direct line to your patients. Quiet, immediate, on your terms.",
  },
  {
    stat: "3–5x",
    label: "valuation multiple on engaged-patient revenue",
    detail:
      "Engagement compounds. The practice is worth more for it.",
  },
];

export const STEPS = [
  {
    icon: Compass,
    title: "Conversation",
    description:
      "We listen first. Your brand, your patients, the moments that matter — mapped before a line is drawn.",
  },
  {
    icon: Hammer,
    title: "Composition",
    description:
      "Native iOS and Android, hand-built around your house. Booking, push, loyalty, referrals — composed, not assembled.",
  },
  {
    icon: Rocket,
    title: "Stewardship",
    description:
      "Shipped under your name. Maintained for the life of the app — every OS release, every store change, every refinement.",
  },
];

export const FEATURES = [
  {
    icon: Smartphone,
    title: "Native iOS and Android",
    description:
      "Published in both stores under your name. Not a template, not a wrapper — a native app your patients keep on their home screen.",
  },
  {
    icon: CalendarCheck,
    title: "Booking, In the App",
    description:
      "Real-time availability, deposits, reminders. Reservations made in your house, not on someone else's portal.",
  },
  {
    icon: Bell,
    title: "A Direct Line",
    description:
      "A quiet, immediate channel from the practice to every patient. A discreet release. A held appointment. Reached without friction.",
  },
  {
    icon: Sparkles,
    title: "Loyalty, Reconsidered",
    description:
      "Tiers, perks, in-app credit — designed around the rhythm of aesthetic patients, not retrofitted from retail.",
  },
  {
    icon: Heart,
    title: "Referral, Built In",
    description:
      "Your patients introduce friends in a single tap. Both sides recognised. Tracked, redeemable, effortless.",
  },
  {
    icon: Palette,
    title: "Resident on the Home Screen",
    description:
      "Your mark on their device. Your icon, tapped by name. A presence no third-party portal can offer.",
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
    caption: "A welcome that picks up where the last visit left off.",
  },
  {
    src: "/showcase/beauty-co-2-services.png",
    alt: "Beauty Co. recommended services grid: Botox, Dermal Fillers, BeautyCo facial, HydraFacial",
    caption:
      "A considered menu — your treatments, your photography, your mark.",
  },
  {
    src: "/showcase/beauty-co-3-rewards.png",
    alt: "Beauty Co. rewards detail screen with how-to-earn points list",
    caption:
      "A membership that rewards a return — perks, credit, and quiet recognition.",
  },
  {
    src: "/showcase/beauty-co-4-messages.png",
    alt: "Beauty Co. messages thread with Kelly, the practice's founder/owner",
    caption:
      "A private line, founder to patient. Personal. On the house.",
  },
  {
    src: "/showcase/beauty-co-5-offers.png",
    alt: "Beauty Co. offers screen with priority booking pass and discount",
    caption:
      "Discreet releases. Priority access. Held for those who belong.",
  },
  {
    src: "/showcase/beauty-co-6-profile.png",
    alt: "Beauty Co. patient profile showing visits, points, and savings",
    caption:
      "A standing record — visits, status, recognition — kept in your name.",
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
