import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Darter",
  description:
    "Darter Terms of Service — the agreement governing your use of our voice AI receptionist platform.",
};

export default function TermsOfServicePage() {
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>
        <h1 className="mt-4 text-4xl font-bold text-text-primary">
          Darter Terms of Service
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Effective Date: April 6, 2026
        </p>

        <div className="mt-10 space-y-8 text-text-secondary leading-relaxed">
          <p>
            This Customer Terms of Service Agreement (&ldquo;Agreement&rdquo;)
            is entered into by and between Darter L.L.C. (&ldquo;Darter,&rdquo;
            &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) and the
            entity or individual purchasing, accessing, or using any of our
            Services (&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or
            &ldquo;your&rdquo;).
          </p>
          <p>
            If you are using the Services on behalf of an organization, you
            represent and warrant that you are authorized to bind that
            organization to this Agreement. In such cases, all references to
            &ldquo;you&rdquo; or &ldquo;Customer&rdquo; herein refer to that
            organization.
          </p>
          <p>
            This Agreement governs your access to and use of Darter&rsquo;s
            software-as-a-service platform, voice AI receptionist solutions,
            call and appointment automation tools, and related services designed
            specifically for aesthetic clinics, med spas, and cosmetic practices
            (&ldquo;Services&rdquo;).
          </p>
          <p>
            By accessing or using the Services, you agree to be bound by this
            Agreement. If you do not agree, do not use the Services.
          </p>

          {/* 1. Definitions */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              1. Definitions
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <strong className="text-text-primary">Affiliate:</strong> Any
                entity that controls, is controlled by, or is under common
                control with a party.
              </li>
              <li>
                <strong className="text-text-primary">Agreement:</strong> This
                Terms of Service, together with any Order Forms, attachments, or
                referenced policies.
              </li>
              <li>
                <strong className="text-text-primary">Darter Materials:</strong>{" "}
                All software, documentation, workflows, AI models, voice
                scripts, integrations, appointment booking logic, and other
                intellectual property provided by Darter.
              </li>
              <li>
                <strong className="text-text-primary">Customer Data:</strong>{" "}
                Any information, data, or content submitted by you or your users
                through the Services, including but not limited to call
                recordings, transcripts, appointment bookings, clinic
                configurations, and patient interaction data.
              </li>
              <li>
                <strong className="text-text-primary">Order Form:</strong> The
                ordering document (digital or written) executed by Customer and
                Darter for subscription Services.
              </li>
              <li>
                <strong className="text-text-primary">Services:</strong>{" "}
                Darter&rsquo;s voice AI receptionist, call handling, appointment
                booking, scheduling, chat automation, integrations, and related
                SaaS offerings for aesthetic clinics and med spas.
              </li>
              <li>
                <strong className="text-text-primary">Users:</strong>{" "}
                Individuals authorized by Customer to use the Services.
              </li>
            </ul>
          </section>

          {/* 2. The Services */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              2. The Services
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              2.1 Access
            </h3>
            <p className="mt-4">
              Subject to this Agreement and applicable fees, Darter grants
              Customer a limited, non-exclusive, non-transferable right to
              access and use the Services during the Subscription Term solely for
              Customer&rsquo;s internal business purposes in connection with
              operating an aesthetic clinic, med spa, or cosmetic practice.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              2.2 Service Description
            </h3>
            <p className="mt-4">
              Darter provides an AI-powered voice receptionist that:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Answers inbound phone calls for Customer&rsquo;s clinic 24/7
              </li>
              <li>
                Books, reschedules, and cancels appointments in real-time
              </li>
              <li>
                Responds to common patient questions about services, pricing,
                and pre/post-care instructions
              </li>
              <li>
                Handles unlimited simultaneous calls without wait times
              </li>
              <li>Routes and escalates calls when appropriate</li>
              <li>
                Provides analytics and tracking of call volume, appointments
                booked, and revenue impact
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              2.3 Software &amp; Updates
            </h3>
            <p className="mt-4">
              Certain features may require you to install or connect software
              integrations. Software may update automatically to improve
              functionality, security, or performance. Any open-source
              components will be governed by their respective licenses.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              2.4 Ownership
            </h3>
            <p className="mt-4">
              All rights, title, and interest in the Services, Darter Materials,
              and all related intellectual property belong exclusively to Darter.
              No rights are granted except as expressly provided herein. Customer
              acknowledges that Darter&rsquo;s voice AI technology, workflows,
              and appointment booking systems are proprietary.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              2.5 Third-Party Products
            </h3>
            <p className="mt-4">
              The Services may integrate with third-party applications, including
              but not limited to scheduling systems, EMR/PMS platforms,
              calendars, and CRM tools (&ldquo;Third-Party Products&rdquo;).
              Customer is responsible for ensuring compliance with any
              third-party terms of service. Darter is not responsible for any
              third-party products or services and disclaims all liability
              arising from their use.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              2.6 Free or Trial Services
            </h3>
            <p className="mt-4">
              Free trials are provided &ldquo;as is&rdquo; without warranty.
              Darter may suspend or terminate free access at any time. Following
              any free trial, Customer must subscribe to a paid plan to continue
              using the Services.
            </p>
          </section>

          {/* 3. Pricing and Plans */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              3. Pricing and Plans
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              3.1 Available Plans
            </h3>

            <div className="mt-4 space-y-6">
              <div>
                <h4 className="font-semibold text-text-primary">
                  Growth Plan
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>$597/month</li>
                  <li>1,500 minutes included</li>
                  <li>$0.25/minute overage charge</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Scale Plan</h4>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>$1,097/month</li>
                  <li>4,000 minutes included</li>
                  <li>$0.22/minute overage charge</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">
                  Enterprise Plan
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>Custom pricing based on Customer requirements</li>
                  <li>Multi-location support</li>
                  <li>Custom SLAs</li>
                  <li>Additional features and configuration options</li>
                </ul>
              </div>
            </div>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              3.2 Billing
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Fees are billed monthly in advance unless otherwise agreed in
                writing.
              </li>
              <li>
                Overage charges are billed in arrears based on actual usage.
              </li>
              <li>All fees are exclusive of applicable taxes.</li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              3.3 Payment Terms
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Payments are due within 30 days of invoice.</li>
              <li>
                Credit card and ACH payments authorize Darter to automatically
                charge the designated account.
              </li>
              <li>
                All fees are non-refundable unless otherwise specified in a
                written agreement.
              </li>
            </ul>
          </section>

          {/* 4. Customer Data */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              4. Customer Data
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              4.1 Ownership
            </h3>
            <p className="mt-4">
              You retain all rights to Customer Data. Darter will not sell your
              data.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              4.2 License to Darter
            </h3>
            <p className="mt-4">
              You grant Darter a limited license to use Customer Data for the
              purpose of delivering and improving the Services, including
              processing calls, booking appointments, generating analytics, and
              providing customer support.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              4.3 Aggregate &amp; De-Identified Data
            </h3>
            <p className="mt-4">
              Darter may use anonymized and aggregated data derived from Customer
              Data to improve Services, train AI models, generate industry
              benchmarks, and create analytics dashboards, provided it does not
              identify you, your clinic, or your patients.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              4.4 Data Security
            </h3>
            <p className="mt-4">
              Darter uses commercially reasonable measures to protect Customer
              Data, including encryption, secure hosting, and access controls.
              Customer is responsible for maintaining the security of account
              credentials and ensuring that integrations with third-party systems
              are secure.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              4.5 Data Processing Addendum
            </h3>
            <p className="mt-4">
              Upon request, Darter will enter into a Data Processing Addendum
              (DPA) with Customer to address specific data protection
              requirements. Contact{" "}
              <a
                href="mailto:privacy@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                privacy@dartertech.com
              </a>{" "}
              for more information.
            </p>
          </section>

          {/* 5. Customer Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              5. Customer Responsibilities
            </h2>
            <p className="mt-4">You agree not to:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Copy, resell, sublicense, or distribute the Services to any
                third party.
              </li>
              <li>
                Use the Services for any unlawful purpose or in violation of any
                applicable laws.
              </li>
              <li>
                Reverse engineer, decompile, or attempt to extract the source
                code of the Services.
              </li>
              <li>
                Share access credentials with unauthorized individuals outside
                of your organization.
              </li>
              <li>
                Use the Services in violation of applicable laws, including but
                not limited to consumer protection, healthcare privacy,
                telecommunications, or call recording laws.
              </li>
              <li>
                Upload or transmit any viruses, malware, or other harmful code.
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Services.
              </li>
              <li>
                Attempt to gain unauthorized access to any systems connected to
                the Services.
              </li>
            </ul>
            <p className="mt-6">You are responsible for:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Ensuring that all Users comply with this Agreement.
              </li>
              <li>
                Maintaining the accuracy and completeness of clinic
                configuration data.
              </li>
              <li>
                Ensuring that your use of the Services complies with applicable
                laws and regulations governing aesthetic clinics, med spas, and
                cosmetic practices.
              </li>
              <li>
                Obtaining all necessary consents and permissions for call
                recording, if applicable.
              </li>
              <li>
                Ensuring that patient information shared with Darter is handled
                in accordance with applicable privacy laws.
              </li>
            </ul>
          </section>

          {/* 6. Fees & Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              6. Fees &amp; Payment
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              6.1 Fees
            </h3>
            <p className="mt-4">
              You agree to pay all fees as specified in the applicable Order Form
              or pricing page. Plan rates are subject to change with 30
              days&rsquo; prior written notice.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              6.2 Billing &amp; Payment
            </h3>
            <p className="mt-4">
              Unless otherwise agreed in writing, payments are due within 30
              days of invoice. By providing credit card or ACH information, you
              authorize Darter to automatically charge fees to the designated
              account.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              6.3 Late Payments
            </h3>
            <p className="mt-4">
              Overdue amounts may incur interest of 1.5% per month or the
              maximum allowed by law, whichever is lower. Darter may suspend
              Services for non-payment if fees remain overdue for more than 15
              days. Upon suspension, Customer data will be retained for up to 30
              days.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              6.4 Taxes
            </h3>
            <p className="mt-4">
              Fees are exclusive of all applicable federal, state, and local
              taxes, levies, or duties. Customer is responsible for all
              applicable sales, use, excise, and similar taxes.
            </p>
          </section>

          {/* 7. Warranties & Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              7. Warranties &amp; Disclaimers
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              7.1 Mutual Warranties
            </h3>
            <p className="mt-4">
              Each party represents that it has the legal power and authority to
              enter into this Agreement and that this Agreement constitutes a
              valid and binding obligation.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              7.2 Darter Warranties
            </h3>
            <p className="mt-4">Darter warrants that:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                The Services will be performed in a professional and
                workmanlike manner.
              </li>
              <li>
                Darter has the right to grant the licenses and access described
                in this Agreement.
              </li>
              <li>
                The Services will comply with applicable laws and regulations in
                all material respects.
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              7.3 Disclaimer
            </h3>
            <p className="mt-4 font-semibold uppercase text-text-primary">
              The Services are provided &ldquo;as is&rdquo; without warranties
              of any kind, express or implied, including but not limited to
              warranties of merchantability, fitness for a particular purpose,
              non-infringement, or error-free operation.
            </p>
            <p className="mt-4">Darter does not warrant that:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                The Services will meet Customer&rsquo;s specific requirements or
                expectations.
              </li>
              <li>
                The Services will be uninterrupted, timely, or completely
                secure.
              </li>
              <li>Any errors or defects will be corrected.</li>
              <li>
                The Services will result in any specific business outcomes,
                including revenue increases or appointment bookings.
              </li>
            </ul>
            <p className="mt-4">
              Customer acknowledges that Darter&rsquo;s AI receptionist uses
              artificial intelligence and machine learning, and results may vary
              based on call content, audio quality, and other factors.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              7.4 Beta Features
            </h3>
            <p className="mt-4">
              Beta features, pilot programs, or preview functionalities are
              experimental and provided &ldquo;as is&rdquo; without guarantees.
              Darter may discontinue beta features at any time.
            </p>
          </section>

          {/* 8. Confidentiality */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              8. Confidentiality
            </h2>
            <p className="mt-4">
              Each party agrees to protect the other party&rsquo;s confidential
              information with at least the same degree of care it uses to
              protect its own confidential information, but no less than
              reasonable care. Confidential information may not be disclosed
              without prior written consent, except:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>As required by law or legal process</li>
              <li>
                To legal or financial advisors under appropriate confidentiality
              </li>
              <li>
                In connection with a corporate transaction with appropriate
                safeguards
              </li>
            </ul>
          </section>

          {/* 9. Term & Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              9. Term &amp; Termination
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              9.1 Term
            </h3>
            <p className="mt-4">
              This Agreement remains in effect for the Subscription Term
              specified in the applicable Order Form, and automatically renews
              for successive periods unless terminated in accordance with this
              Section.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              9.2 Termination for Convenience
            </h3>
            <p className="mt-4">
              Either party may terminate this Agreement:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Upon 30 days&rsquo; prior written notice before the end of the
                Subscription Term.
              </li>
              <li>
                Customer may downgrade or cancel their subscription through the
                account portal or by written request.
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              9.3 Termination for Cause
            </h3>
            <p className="mt-4">
              Either party may terminate this Agreement immediately upon written
              notice if the other party:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Materially breaches this Agreement and fails to cure within 30
                days of receiving written notice.
              </li>
              <li>
                Becomes insolvent, files for bankruptcy, or ceases to operate.
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              9.4 Effect of Termination
            </h3>
            <p className="mt-4">Upon termination:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Customer&rsquo;s right to access and use the Services ends
                immediately.
              </li>
              <li>
                All fees owed through the termination date become immediately
                due.
              </li>
              <li>
                Darter will retain Customer Data for 30 days following
                termination.
              </li>
              <li>
                After the retention period, Darter may delete Customer Data
                unless otherwise required by law.
              </li>
            </ul>
          </section>

          {/* 10. Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              10. Indemnification
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              10.1 Darter Indemnification
            </h3>
            <p className="mt-4">
              Darter will indemnify, defend, and hold Customer harmless from any
              third-party claim that the Services infringe or misappropriate
              that third party&rsquo;s intellectual property rights, provided
              that Customer:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>Promptly notifies Darter of any claim</li>
              <li>Allows Darter to control the defense and settlement</li>
              <li>Provides reasonable cooperation</li>
            </ul>
            <p className="mt-4">
              If the Services are found to infringe, Darter may, at its option:
              (a) modify the Services to be non-infringing; (b) replace with
              non-infringing alternatives; or (c) terminate the Agreement and
              refund prepaid fees.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              10.2 Customer Indemnification
            </h3>
            <p className="mt-4">
              Customer will indemnify, defend, and hold Darter harmless from any
              third-party claim arising from:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                Customer Data, including any claims related to patient
                information or call recordings
              </li>
              <li>
                Customer&rsquo;s use of the Services in violation of this
                Agreement or applicable law
              </li>
              <li>
                Customer&rsquo;s aesthetic clinic, med spa, or cosmetic practice
                operations
              </li>
              <li>Any products or services offered by Customer</li>
            </ul>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              11. Limitation of Liability
            </h2>
            <p className="mt-4">To the fullest extent permitted by law:</p>
            <p className="mt-4 font-semibold uppercase text-text-primary">
              Except for indemnification obligations, breaches of
              confidentiality, or gross negligence or willful misconduct:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li className="uppercase font-semibold text-text-primary">
                Neither party is liable for any indirect, incidental, special,
                consequential, or punitive damages, including but not limited to
                loss of profits, revenue, data, or business opportunities, even
                if advised of the possibility of such damages.
              </li>
              <li className="uppercase font-semibold text-text-primary">
                Darter&rsquo;s total cumulative liability under this Agreement
                will not exceed the fees paid by Customer in the twelve (12)
                months preceding the claim.
              </li>
            </ul>
            <p className="mt-4">
              Customer acknowledges that the pricing of the Services reflects
              this allocation of risk and that the limitations in this Section
              are essential to the basis of the bargain.
            </p>
          </section>

          {/* 12. Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              12. Intellectual Property
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              12.1 Darter IP
            </h3>
            <p className="mt-4">
              Darter retains all rights in and to:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                The Darter platform, including voice AI technology, natural
                language processing, appointment booking logic, and workflow
                automation
              </li>
              <li>
                All Darter Materials, documentation, and training content
              </li>
              <li>
                Any improvements, enhancements, or modifications to the Services
              </li>
              <li>
                Aggregated and anonymized data derived from Customer&rsquo;s use
                of the Services
              </li>
            </ul>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              12.2 Feedback
            </h3>
            <p className="mt-4">
              If Customer provides suggestions, ideas, or feedback about the
              Services, Darter may use them without obligation to Customer.
            </p>
          </section>

          {/* 13. General Provisions */}
          <section>
            <h2 className="text-2xl font-semibold text-text-primary">
              13. General Provisions
            </h2>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.1 Relationship
            </h3>
            <p className="mt-4">
              The parties are independent contractors. Nothing in this Agreement
              creates a partnership, joint venture, agency, or employment
              relationship.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.2 Notices
            </h3>
            <p className="mt-4">Notices must be sent in writing to:</p>
            <p className="mt-2">
              <strong className="text-text-primary">Darter:</strong>{" "}
              <a
                href="mailto:legal@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                legal@dartertech.com
              </a>{" "}
              or to Darter&rsquo;s registered business address.
            </p>
            <p className="mt-2">
              <strong className="text-text-primary">Customer:</strong> The email
              address or address provided during account registration or on the
              Order Form.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.3 Assignment
            </h3>
            <p className="mt-4">
              Neither party may assign this Agreement without the other&rsquo;s
              prior written consent, except in connection with a merger,
              acquisition, or sale of substantially all assets. Any attempted
              assignment in violation is void.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.4 Governing Law
            </h3>
            <p className="mt-4">
              This Agreement is governed by the laws of the State of North
              Carolina, without regard to conflict of law principles.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.5 Dispute Resolution
            </h3>
            <p className="mt-4">
              Any disputes arising under or in connection with this Agreement
              shall be resolved through binding arbitration in North Carolina
              under the rules of JAMS (Judicial Arbitration and Mediation
              Services). Customer agrees to resolve disputes individually and
              waives any right to participate in class actions or collective
              proceedings.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.6 Force Majeure
            </h3>
            <p className="mt-4">
              Neither party is liable for delays or failures in performance
              resulting from circumstances beyond that party&rsquo;s reasonable
              control, including natural disasters, government actions,
              telecommunications failures, or third-party service outages.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.7 Modifications
            </h3>
            <p className="mt-4">
              Darter may modify this Agreement from time to time. Material
              changes will be communicated via email or notice through the
              Services. Continued use of the Services after changes take effect
              constitutes acceptance of the modified Agreement.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.8 Entire Agreement
            </h3>
            <p className="mt-4">
              This Agreement, together with any Order Forms, pricing pages, and
              referenced policies, constitutes the entire agreement between the
              parties and supersedes all prior agreements, understandings, and
              communications relating to the subject matter herein.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.9 Waiver
            </h3>
            <p className="mt-4">
              Failure to enforce any provision of this Agreement does not
              constitute a waiver of that provision or any other provision.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.10 Severability
            </h3>
            <p className="mt-4">
              If any provision of this Agreement is held invalid or
              unenforceable, the remaining provisions will remain in full force
              and effect.
            </p>

            <h3 className="mt-6 text-xl font-medium text-text-primary">
              13.11 No Third-Party Beneficiaries
            </h3>
            <p className="mt-4">
              This Agreement is for the sole benefit of the parties and their
              permitted successors and assigns. There are no third-party
              beneficiaries.
            </p>
          </section>

          {/* 14. Contact Information */}
          <section className="border-t border-border pt-8">
            <h2 className="text-2xl font-semibold text-text-primary">
              14. Contact Information
            </h2>
            <p className="mt-4">Darter L.L.C. (Darter)</p>
            <p className="mt-1">
              Email:{" "}
              <a
                href="mailto:legal@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                legal@dartertech.com
              </a>
            </p>
            <p className="mt-1">
              Support:{" "}
              <a
                href="mailto:support@dartertech.com"
                className="text-accent-400 underline hover:text-accent-300"
              >
                support@dartertech.com
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
