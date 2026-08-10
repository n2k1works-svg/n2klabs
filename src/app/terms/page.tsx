import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions governing the use of N2K Labs' website and digital services. Covers scope of services, payment, intellectual property, and liability.",
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "10 August 2026";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the website operated by N2K Labs at{" "}
          <a
            href={siteConfig.url}
            className="text-[var(--accent)] hover:underline"
          >
            {siteConfig.url}
          </a>{" "}
          (the &ldquo;Site&rdquo;) and any digital services we provide
          (collectively, the &ldquo;Services&rdquo;).
        </p>
        <p>
          By accessing the Site or engaging our Services, you agree to be bound by
          these Terms. If you do not agree, please do not use the Site or engage
          our Services.
        </p>
        <p>
          If you are engaging our Services on behalf of a company or
          organization, you represent and warrant that you have the authority to
          bind that entity to these Terms.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "2. Description of Services",
    body: (
      <>
        <p>
          N2K Labs is a digital studio offering the following services to
          clients:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Web Development</strong> &mdash; design and build of custom
            websites and web applications.
          </li>
          <li>
            <strong>UI/UX Design</strong> &mdash; user interface and user
            experience design for digital products.
          </li>
          <li>
            <strong>E-Commerce Solutions</strong> &mdash; online stores, payment
            integration, and commerce platforms.
          </li>
          <li>
            <strong>Digital Strategy</strong> &mdash; consulting on digital
            transformation, roadmaps, and growth.
          </li>
          <li>
            <strong>Brand Identity</strong> &mdash; logo design, brand
            guidelines, and visual identity systems.
          </li>
          <li>
            <strong>SEO &amp; Analytics</strong> &mdash; search engine
            optimization and performance measurement.
          </li>
        </ul>
        <p>
          The specific scope, deliverables, timeline, and cost of any engagement
          will be defined in a separate written proposal or contract
          (&ldquo;Statement of Work&rdquo;) agreed between N2K Labs and the
          client.
        </p>
        <p>
          In the event of any conflict between these Terms and a Statement of
          Work, the Statement of Work prevails for that engagement.
        </p>
      </>
    ),
  },
  {
    id: "client-responsibilities",
    title: "3. Client Responsibilities",
    body: (
      <>
        <p>To enable us to deliver the Services, the client agrees to:</p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            Provide accurate, complete, and timely information required for the
            project.
          </li>
          <li>
            Provide timely feedback and approvals at agreed review points.
          </li>
          <li>
            Ensure they have the necessary rights to any content, materials, or
            assets provided to N2K Labs for use in the project.
          </li>
          <li>
            Make timely payments in accordance with the agreed payment schedule.
          </li>
          <li>
            Maintain any third-party accounts, licenses, or subscriptions
            required for the operation of the delivered work (e.g. domain
            registration, hosting, payment gateways).
          </li>
        </ul>
        <p>
          Delays caused by the client (including delayed feedback, missing
          content, or late payment) may result in adjusted timelines and
          additional fees.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "4. Payment Terms",
    body: (
      <>
        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          4.1 Fees and invoicing
        </h3>
        <p>
          Fees for Services are specified in the Statement of Work. Unless
          otherwise agreed:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            A deposit of 50% of the total project fee is due before work
            commences.
          </li>
          <li>
            The remaining balance is due upon project completion, prior to
            deployment or handover.
          </li>
          <li>
            Recurring services (e.g. maintenance, hosting, retainers) are billed
            in advance on a monthly basis.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          4.2 Late payment
        </h3>
        <p>
          Invoices are due within 14 days of issuance. Overdue invoices accrue
          interest at 1.5% per month. We reserve the right to suspend Services or
          withhold access to deliverables on overdue accounts.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          4.3 Taxes
        </h3>
        <p>
          Fees are exclusive of applicable taxes, including Fiji VAT where
          applicable. Clients are responsible for any taxes assessed on their
          behalf.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property",
    body: (
      <>
        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          5.1 Client-owned content
        </h3>
        <p>
          The client retains all rights to content and materials provided to N2K
          Labs for inclusion in the project. The client grants N2K Labs a
          non-exclusive license to use such content for the duration of the
          engagement to deliver the Services.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          5.2 Deliverables
        </h3>
        <p>
          Upon receipt of full payment, ownership of the final deliverables
          (including source code, design files, and assets specifically created
          for the project) transfers to the client, subject to:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Pre-existing components:</strong> N2K Labs retains ownership
            of pre-existing tools, frameworks, templates, and methodologies used
            in the project, and grants the client a perpetual, non-exclusive
            license to use them as part of the delivered work.
          </li>
          <li>
            <strong>Open-source software:</strong> Third-party open-source
            software remains licensed under its original terms.
          </li>
          <li>
            <strong>Portfolio rights:</strong> N2K Labs may display and describe
            the completed work in our portfolio and marketing materials, unless
            the client requests otherwise in writing.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          5.3 Third-party assets
        </h3>
        <p>
          Where third-party assets (fonts, stock images, plugins) are used, the
          client is responsible for maintaining any required licenses for ongoing
          use unless N2K Labs has agreed to purchase them on the client&rsquo;s
          behalf (the cost will be itemized in the Statement of Work).
        </p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "6. Confidentiality",
    body: (
      <>
        <p>
          Both parties agree to keep confidential any non-public information
          received from the other party in connection with the engagement,
          including business plans, customer data, and technical information.
        </p>
        <p>
          Confidentiality obligations survive the termination of the engagement
          and do not apply to information that is publicly available, already
          known, independently developed, or required to be disclosed by law.
        </p>
      </>
    ),
  },
  {
    id: "warranties",
    title: "7. Warranties and Disclaimers",
    body: (
      <>
        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          7.1 Workmanship warranty
        </h3>
        <p>
          N2K Labs warrants that the Services will be performed in a
          professional, workmanlike manner consistent with industry standards.
          We will correct any material defects in our work reported within 30 days
          of delivery at no additional cost.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          7.2 Disclaimers
        </h3>
        <p>
          Except as expressly stated in these Terms or a Statement of Work, the
          Services are provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;. N2K Labs disclaims all other warranties, express or
          implied, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>Merchantability or fitness for a particular purpose.</li>
          <li>
            That the Site or Services will be uninterrupted, error-free, or
            secure.
          </li>
          <li>
            That results such as search rankings, traffic, or conversions will
            meet any specific target.
          </li>
        </ul>
        <p>
          The client is responsible for maintaining backups of their data. N2K
          Labs is not liable for data loss resulting from the client&rsquo;s
          failure to maintain backups or from circumstances beyond our control.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    body: (
      <>
        <p>
          To the maximum extent permitted by law, N2K Labs&rsquo; total liability
          arising out of or related to the Services, whether in contract, tort,
          or otherwise, shall not exceed the total amount paid by the client to
          N2K Labs for the specific engagement giving rise to the claim during
          the 12 months preceding the claim.
        </p>
        <p>
          In no event shall N2K Labs be liable for:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>Indirect, incidental, special, or consequential damages.</li>
          <li>Loss of profits, revenue, data, or business opportunities.</li>
          <li>
            Damages resulting from the client&rsquo;s misuse of the Services or
            failure to follow our recommendations.
          </li>
          <li>
            Damages resulting from third-party services, software, or hosting
            not provided by N2K Labs.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "termination",
    title: "9. Termination",
    body: (
      <>
        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          9.1 Termination by either party
        </h3>
        <p>
          Either party may terminate an engagement with 30 days&rsquo; written
          notice. Upon termination:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            The client pays for all Services rendered and expenses incurred up to
            the termination date.
          </li>
          <li>
            N2K Labs delivers any completed work for which payment has been
            received.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          9.2 Termination for cause
        </h3>
        <p>
          N2K Labs may terminate immediately if the client breaches these Terms
          or a Statement of Work and fails to cure the breach within 7 days of
          written notice. We may also terminate immediately if the client
          becomes insolvent or bankrupt.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          9.3 Access to the Site
        </h3>
        <p>
          We reserve the right to suspend or terminate access to the Site for
          any user who violates these Terms or engages in abusive, unlawful, or
          disruptive behavior.
        </p>
      </>
    ),
  },
  {
    id: "disputes",
    title: "10. Dispute Resolution and Governing Law",
    body: (
      <>
        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          10.1 Governing law
        </h3>
        <p>
          These Terms and any engagement with N2K Labs are governed by the laws
          of the Republic of Fiji, without regard to conflict-of-law principles.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          10.2 Dispute resolution
        </h3>
        <p>
          The parties agree to attempt in good faith to resolve any dispute
          through direct negotiation. If negotiation fails, disputes shall be
          submitted to mediation in Fiji. If mediation is unsuccessful, the
          dispute shall be finally resolved by the courts of Fiji.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to These Terms",
    body: (
      <>
        <p>
          We may update these Terms from time to time. The &ldquo;Last
          updated&rdquo; date at the top of this page indicates when the Terms
          were last revised. Material changes to active engagements will be
          communicated to clients in writing.
        </p>
        <p>
          Continued use of the Site or Services after changes take effect
          constitutes acceptance of the updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "12. Contact Us",
    body: (
      <>
        <p>
          If you have questions about these Terms or wish to discuss a potential
          engagement, please contact us:
        </p>
        <div className="mt-4 border border-white/10 rounded-lg p-5 bg-white/[0.02] space-y-2">
          <div className="font-semibold text-[#f0ece6]">N2K Labs</div>
          <div className="text-sm text-[#8a8a93]">
            South Pacific, Fiji
          </div>
          <div className="text-sm">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-[var(--accent)] hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The terms and conditions governing our digital services."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  );
}
