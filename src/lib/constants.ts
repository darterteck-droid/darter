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
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About Us", href: "#founders" },
];

export const STATS = [
  {
    stat: "30%",
    label: "of inbound calls go unanswered",
    detail:
      "Your front desk can't answer every ring while checking in patients, handling paperwork, and managing the schedule.",
  },
  {
    stat: "62%",
    label: "of callers won't leave a voicemail",
    detail:
      "They'll call your competitor instead. One missed call means one lost patient — often permanently.",
  },
  {
    stat: "$200+",
    label: "average revenue per missed call",
    detail:
      "Between Botox, fillers, and laser treatments, a single missed consultation call costs you hundreds.",
  },
];

export const STEPS = [
  {
    icon: Phone,
    title: "Darter Answers Every Call",
    description:
      "When a patient calls your clinic, Darter picks up instantly — day or night, weekday or weekend. No hold music. No voicemail. Just a warm, natural-sounding AI voice ready to help.",
  },
  {
    icon: CalendarCheck,
    title: "Books Appointments & Answers Questions",
    description:
      "Darter checks real-time availability, books appointments, answers common questions about services and pricing, and handles the conversation just like your best receptionist would.",
  },
  {
    icon: RefreshCw,
    title: "Syncs With Your Systems",
    description:
      "Every booking, call summary, and patient detail syncs directly to your clinic management software. Your team starts each day fully up to speed.",
  },
];

export const FEATURES = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Every call answered, every hour of every day. Nights, weekends, holidays — Darter never takes a break.",
  },
  {
    icon: Mic,
    title: "Natural-Sounding AI",
    description:
      "Patients won't know they're speaking with AI. Darter sounds warm, professional, and human.",
  },
  {
    icon: CalendarPlus,
    title: "Appointment Booking",
    description:
      "Real-time scheduling that checks availability and confirms bookings on the spot.",
  },
  {
    icon: MessageCircleQuestion,
    title: "FAQ Handling",
    description:
      "Pricing, services, prep instructions, aftercare — Darter answers the questions your team fields every day.",
  },
  {
    icon: FileText,
    title: "Call Summaries",
    description:
      "Get a detailed summary of every call — who called, what they needed, and what was booked.",
  },
  {
    icon: Plug,
    title: "Seamless Integrations",
    description:
      "Connects with your existing clinic software, calendar, and CRM. No workflow disruption.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "Darter paid for itself in the first week.",
    body: "We were missing 8–10 calls a day during peak hours. Now every single one gets answered and half of those are booked before my team even checks the dashboard.",
    name: "Dr. Sarah Chen",
    title: "Medical Director, Glow Aesthetics — Los Angeles",
  },
  {
    quote: "Our no-show rate dropped by 35%.",
    body: "Darter confirms appointments and sends reminders automatically. Patients love how easy it is, and we love not chasing people down.",
    name: "Rachel Kim",
    title: "Practice Manager, Luxe Skin Clinic — Miami",
  },
  {
    quote: "It's like hiring the perfect receptionist who never calls in sick.",
    body: "We went from losing weekend calls to booking them. The ROI was obvious within a month.",
    name: "Dr. James Whitfield",
    title: "Owner, Revive MedSpa — New York",
  },
];
