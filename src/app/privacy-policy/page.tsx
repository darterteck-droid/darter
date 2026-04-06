import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Darter",
  description:
    "Darter Privacy Policy — learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text-primary">
          Darter Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Effective Date: April 6, 2026
        </p>

        <div className="mt-10 space-y-8 text-text-secondary leading-relaxed">
          <p>
            Your privacy is important to us. This Privacy Policy
            (&ldquo;Policy&rdquo;) applies to services provided by Darter
            L.L.C. (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;Darter&rdquo;) and our website{" "}
            <Link
              href="https://www.dartertech.com/"
              className="text-accent-400 underline hover:text-accent-300"
            >
              https://www.dartertech.com/
            </Link>{" "}
            (the &ldquo;Site&rdquo;), product pages, mobile or web
            applications, or other digital services that link to or reference
            this Policy (collectively, the &ldquo;Services&rdquo;). This Policy
            explains what information we collect from users of our Services (a
            &ldquo;user&rdquo;, &ldquo;you&rdquo;, or &ldquo;your&rdquo;),
            including information that may identify you personally
            (&ldquo;Personal Information&rdquo;), and how we use it.
          </p>
          <p>
            We may update this Policy from time to time. When we make material
            changes, we will post the new Policy here and/or notify you via the
            email address linked to your account. Your continued use of our
            Services means you agree to the updated Policy.
          </p>

          {/* Scope and Applicability */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Scope and Applicability
            </h2>
            <p className="mt-4">
              This Policy applies when you visit our website, interact with our
              Services, or otherwise engage with Darter. Please note:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                When Darter processes data on behalf of our business customers
                (for example, handling customer calls, recordings, or
                appointment bookings for aesthetic clinics), we do so in the role
                of a data processor (or &ldquo;service provider&rdquo; in
                certain jurisdictions). In those cases, our Customers are the
                data controllers and their own privacy policies apply.
              </li>
              <li>
                This Policy does not cover third-party tools, apps, or services
                you connect with Darter (e.g., scheduling systems, EMR/PMS
                platforms, calendars, or CRM tools). Those services are governed
                by their own privacy policies.
              </li>
            </ul>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Information We Collect
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              Information You Provide
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <strong className="text-text-primary">
                  Account Information:
                </strong>{" "}
                name, email, phone number, password, and authentication
                credentials.
              </li>
              <li>
                <strong className="text-text-primary">
                  Payment Information:
                </strong>{" "}
                if you purchase Services, our payment processor (currently
                Stripe) collects and processes your payment method and billing
                details. Darter stores only non-sensitive details (e.g., last
                four digits, card type).
              </li>
              <li>
                <strong className="text-text-primary">
                  Clinic Configuration Data:
                </strong>{" "}
                when setting up Darter for your aesthetic clinic or med spa, you
                may provide business information, staff names, service
                offerings, pricing details, scheduling preferences, and workflow
                configurations.
              </li>
              <li>
                <strong className="text-text-primary">
                  Recordings &amp; Customer Data:
                </strong>{" "}
                when using our voice AI receptionist Services, Customers may
                submit or generate call recordings, transcripts, appointment
                bookings, or patient interaction data. We process these strictly
                under our Customer&rsquo;s instructions.
              </li>
              <li>
                <strong className="text-text-primary">
                  Business Contact Information:
                </strong>{" "}
                if you represent a business, we may collect your name, job
                title, company, and contact details.
              </li>
              <li>
                <strong className="text-text-primary">
                  Other Information:
                </strong>{" "}
                if you register for demos, webinars, support, or otherwise
                communicate with us.
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              Information Collected Automatically
            </h3>
            <p className="mt-4">
              When you interact with our Services, we may collect:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <strong className="text-text-primary">Log Data:</strong> IP
                address, browser type, date/time, and interactions with our
                Site.
              </li>
              <li>
                <strong className="text-text-primary">Usage Data:</strong>{" "}
                features used, actions taken, call volumes, appointment
                bookings, and activity within the Services.
              </li>
              <li>
                <strong className="text-text-primary">
                  Device Information:
                </strong>{" "}
                device type, operating system, browser, and settings.
              </li>
              <li>
                <strong className="text-text-primary">Analytics Data:</strong>{" "}
                cookies and similar technologies (see &ldquo;Tracking
                Technologies&rdquo; below).
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              Information from Third Parties
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Authentication Providers (e.g., Google login).</li>
              <li>
                Partners &amp; Service Providers who help us run our Services.
              </li>
              <li>
                EMR/PMS Integration Partners with whom you connect your Darter
                account.
              </li>
              <li>
                Public or Commercial Sources, such as LinkedIn profiles or
                industry databases.
              </li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              How We Use Information
            </h2>
            <p className="mt-4">We use collected information to:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Provide, operate, and improve our voice AI receptionist Services
                for aesthetic clinics and med spas.
              </li>
              <li>Authenticate users and enable account features.</li>
              <li>Process payments, invoices, and subscriptions.</li>
              <li>
                Book, reschedule, and manage appointments on behalf of our
                Customers&rsquo; clinics.
              </li>
              <li>Respond to inquiries and provide customer support.</li>
              <li>
                Analyze usage trends, call patterns, and improve Service
                performance.
              </li>
              <li>Prevent fraud, security issues, and misuse.</li>
              <li>Comply with legal obligations.</li>
              <li>
                Send service-related communications (e.g., security alerts,
                updates, invoices) and send marketing communications about
                Darter.
              </li>
              <li>
                Create aggregated, anonymized data for analytics and research.
              </li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Sharing Your Information
            </h2>
            <p className="mt-4">We may share Personal Information:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                With Customers (when we act as a processor providing Services on
                their behalf, including their clinic staff and authorized users).
              </li>
              <li>
                With trusted service providers (e.g., AWS, Vercel, ElevenLabs,
                telephony providers) who support our infrastructure and
                operations.
              </li>
              <li>
                With Integration Partners (EMR/PMS systems, scheduling
                platforms) when you connect those services with Darter, subject
                to your configuration settings.
              </li>
              <li>
                In corporate transactions (e.g., mergers, acquisitions, or
                reorganizations).
              </li>
              <li>
                To comply with law, enforce agreements, or protect
                Darter&rsquo;s rights and users&rsquo; safety.
              </li>
              <li>With your consent or direction.</li>
            </ul>
            <p className="mt-4 font-medium text-text-primary">
              We do not sell your Personal Information.
            </p>
          </section>

          {/* Tracking Technologies */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Tracking Technologies (Cookies)
            </h2>
            <p className="mt-4">
              Darter uses cookies and similar technologies to:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Keep you logged in.</li>
              <li>
                Remember preferences and clinic configurations.
              </li>
              <li>
                Understand how Services are used, including call handling
                metrics.
              </li>
              <li>Improve functionality and performance.</li>
            </ul>
            <p className="mt-4">
              You can control cookies via your browser, but disabling them may
              limit some functionality.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Security
            </h2>
            <p className="mt-4">
              We use industry-standard security measures to protect your data,
              including:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure hosting infrastructure</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular security assessments</li>
            </ul>
            <p className="mt-4">
              However, no system is 100% secure. You are responsible for keeping
              your account password confidential and maintaining the security of
              your integrated systems.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Data Retention
            </h2>
            <p className="mt-4">
              We retain Personal Information as long as necessary to provide our
              Services or comply with legal obligations. Customer data (e.g.,
              call recordings, transcripts, appointment bookings) is retained
              according to our Customer agreements and can be configured based on
              your clinic&rsquo;s preferences.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Your Rights
            </h2>
            <p className="mt-4">
              Depending on where you live, you may have rights under applicable
              privacy laws (e.g., GDPR, CCPA):
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Access, update, or delete your Personal Information.</li>
              <li>Object to or restrict processing.</li>
              <li>
                Withdraw consent where processing is based on consent.
              </li>
              <li>Request data portability.</li>
            </ul>
            <p className="mt-4">
              To exercise your rights, contact us at{" "}
              <a
                href="mailto:privacy@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                privacy@dartertech.com
              </a>
              .
            </p>
          </section>

          {/* Special Category Data */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Special Category Data (Health Information)
            </h2>
            <p className="mt-4">
              Darter is designed for use by aesthetic clinics and medical spas.
              While we process voice interactions and appointment data, we are
              not a covered entity under HIPAA. However, we take data protection
              seriously:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                We implement appropriate technical and organizational measures
                to protect personal data.
              </li>
              <li>
                Customers are responsible for ensuring that any patient
                information shared with Darter complies with applicable
                healthcare privacy laws.
              </li>
              <li>
                Call recordings and transcripts are processed at the direction of
                our Customers (the clinics) and are governed by their privacy
                practices.
              </li>
            </ul>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Children
            </h2>
            <p className="mt-4">
              Darter is not directed to children under 16, and we do not
              knowingly collect their data. If you believe we have collected data
              from a child, contact us at{" "}
              <a
                href="mailto:privacy@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                privacy@dartertech.com
              </a>{" "}
              and we will delete it.
            </p>
          </section>

          {/* Region-Specific Disclosures */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              Region-Specific Disclosures
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              European Residents (GDPR)
            </h3>
            <p className="mt-4">
              Our legal bases for processing may include:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Your consent.</li>
              <li>
                Performance of a contract (providing our AI receptionist
                Services).
              </li>
              <li>
                Legitimate interests (improving our Services, preventing fraud).
              </li>
              <li>Legal obligations.</li>
            </ul>
            <p className="mt-4">
              You may also lodge a complaint with your local data protection
              authority.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              California Residents (CCPA)
            </h3>
            <p className="mt-4">
              You have the right to know what personal information we collect and
              how it&rsquo;s used. We do not sell your personal information. To
              exercise your rights, contact us at{" "}
              <a
                href="mailto:privacy@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                privacy@dartertech.com
              </a>
              .
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-border pt-8">
            <h2 className="text-2xl font-semibold text-text-primary">
              Contact
            </h2>
            <p className="mt-4">Darter L.L.C. (Darter)</p>
            <p className="mt-1">
              Contact:{" "}
              <a
                href="mailto:privacy@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                privacy@dartertech.com
              </a>
            </p>
            <p className="mt-4 text-sm text-text-muted">
              Last updated: April 6, 2026
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
