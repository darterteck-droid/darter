import Link from "next/link";

/* ── Compliance badge SVGs ── */

function sealPath(cx: number, cy: number, outerR: number, innerR: number, scallops: number) {
  const pts: string[] = [];
  const total = scallops * 2;
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

const SEAL = sealPath(50, 50, 47, 40, 18);
const SHIELD = "M50 4 C50 4 90 18 90 18 L90 48 C90 74 72 90 50 98 C28 90 10 74 10 48 L10 18 Z";

function Soc2Badge({ type }: { type: "I" | "II" }) {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 sm:h-20 sm:w-20" aria-label={`AICPA SOC 2 Type ${type}`}>
      <path d={SEAL} fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="50" y="34" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="600" fontFamily="sans-serif">AICPA</text>
      <text x="50" y="52" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="700" fontFamily="sans-serif">SOC 2</text>
      <text x="50" y="63" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="sans-serif">★ ★ ★</text>
      <text x="50" y="76" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="600" fontFamily="sans-serif">{`TYPE ${type}`}</text>
    </svg>
  );
}

function IsoBadge() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 sm:h-20 sm:w-20" aria-label="ISO 27001">
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="50" y="50" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="700" fontFamily="sans-serif" dominantBaseline="central">ISO</text>
      <text x="50" y="70" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="600" fontFamily="sans-serif">27001</text>
    </svg>
  );
}

function GdprBadge() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 sm:h-20 sm:w-20" aria-label="GDPR">
      <path d={SHIELD} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Padlock shackle */}
      <path d="M40 48 V40 C40 30 60 30 60 40 V48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Padlock body */}
      <rect x="36" y="48" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Keyhole */}
      <circle cx="50" cy="56" r="2.5" fill="currentColor" />
      <rect x="48.8" y="56" width="2.4" height="5" rx="1" fill="currentColor" />
      <text x="50" y="84" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="700" fontFamily="sans-serif">GDPR</text>
    </svg>
  );
}

function HipaaBadge() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 sm:h-20 sm:w-20" aria-label="HIPAA">
      <path d={SHIELD} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Caduceus - staff */}
      <line x1="50" y1="20" x2="50" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Wings */}
      <path d="M50 24 L38 19 L43 25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 24 L62 19 L57 25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Serpents */}
      <path d="M50 28 Q42 33 50 38 Q58 43 50 48 Q42 53 50 58" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 28 Q58 33 50 38 Q42 43 50 48 Q58 53 50 58" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <text x="50" y="82" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" fontFamily="sans-serif">HIPAA</text>
    </svg>
  );
}

function ComplianceBadges() {
  return (
    <div className="rounded-2xl bg-accent-400/[0.07] px-6 py-5">
      <div className="flex flex-wrap items-center justify-center gap-5 text-accent-500 sm:gap-8">
        <Soc2Badge type="I" />
        <Soc2Badge type="II" />
        <IsoBadge />
        <GdprBadge />
        <HipaaBadge />
      </div>
    </div>
  );
}

const footerLinks = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-accent-400">
              Darter
            </Link>
            <p className="mt-3 text-sm text-text-secondary">
              The AI receptionist for aesthetic clinics.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                {heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center gap-8">
            <ComplianceBadges />
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Darter. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
