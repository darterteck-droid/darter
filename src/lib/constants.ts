import {
  Phone,
  CalendarCheck,
  RefreshCw,
  Clock,
  Mic,
  CalendarPlus,
  MessageCircleQuestion,
  FileText,
  Plug,
} from "lucide-react";

export const DEMO_URL = "https://cal.com/darter-oi0epj/30min";

export const NAV_LINKS = [
  { label: "Platform", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "About Us", href: "#founders" },
];

export const STATS = [
  {
    stat: "30%",
    label: "of inbound calls go unanswered",
    detail:
      "Your front desk can't pick up every ring while managing patients and paperwork.",
  },
  {
    stat: "62%",
    label: "of callers won't leave a voicemail",
    detail:
      "They'll call your competitor instead. One missed call, one lost patient.",
  },
  {
    stat: "$200+",
    label: "average revenue per missed call",
    detail:
      "A single missed consultation costs you hundreds in lost treatments.",
  },
];

export const STEPS = [
  {
    icon: Phone,
    title: "Darter Answers Every Call",
    description:
      "Day or night, Darter picks up instantly. No hold music. No voicemail.",
  },
  {
    icon: CalendarCheck,
    title: "Books Appointments & Answers Questions",
    description:
      "Checks availability, books appointments, and answers common questions. Like your best receptionist.",
  },
  {
    icon: RefreshCw,
    title: "Syncs With Your Systems",
    description:
      "Every booking and call summary syncs to your clinic software automatically.",
  },
];

export const FEATURES = [
  {
    icon: Clock,
    title: "24/7 Call Coverage",
    description:
      "Every call answered. Nights, weekends, lunch hours, and holidays included.",
  },
  {
    icon: Mic,
    title: "A Natural, Professional Voice",
    description:
      "Polished, calm, and conversational. Patients feel taken care of from the start.",
  },
  {
    icon: CalendarPlus,
    title: "Appointment Booking",
    description:
      "Real-time scheduling. Check availability and book while patient intent is high.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Answers to Everyday Questions",
    description:
      "Services, pricing, pre-care, post-care. Handled automatically.",
  },
  {
    icon: FileText,
    title: "Call Summaries",
    description:
      "Who called, what they needed, and what action was taken. All in one place.",
  },
  {
    icon: Plug,
    title: "Seamless Integrations",
    description:
      "Connects with your existing tools, calendars, and workflows.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "Darter paid for itself in the first week.",
    body: "We were missing 8–10 calls a day during peak hours. Now every single one gets answered and half of those are booked before my team even checks the dashboard.",
    name: "Dr. Sarah Chen",
    title: "Medical Director, Glow Aesthetics, Los Angeles",
  },
  {
    quote: "Our no-show rate dropped by 35%.",
    body: "Darter confirms appointments and sends reminders automatically. Patients love how easy it is, and we love not chasing people down.",
    name: "Rachel Kim",
    title: "Practice Manager, Luxe Skin Clinic, Miami",
  },
  {
    quote: "It's like hiring the perfect receptionist who never calls in sick.",
    body: "We went from losing weekend calls to booking them. The ROI was obvious within a month.",
    name: "Dr. James Whitfield",
    title: "Owner, Revive MedSpa, New York",
  },
];
