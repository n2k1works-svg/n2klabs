import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How N2K Labs collects, uses, and protects your personal data. Covers contact form submissions, cookies, analytics, and third-party processors.",
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const LAST_UPDATED = "11 August 2026";

const SECTIONS = [
  {
    id: "overview",
    title: "1. Overview",
    body: (
      <>
        <p>
          N2K Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a
          digital studio operated by an individual freelancer based in the South
          Pacific, Fiji. We are currently operating as an unregistered sole
          proprietor and are in the process of formalising our business
          registration. We operate the website at{" "}
          <a
            href={siteConfig.url}
            className="text-[var(--accent)] hover:underline"
          >
            {siteConfig.url}
          </a>{" "}
          (the &ldquo;Site&rdquo;).
        </p>
        <p>
          This Privacy Policy explains what personal data we collect, how we use
          it, who we share it with, and the rights you have over it. By using the
          Site, you agree to the practices described here.
        </p>
        <p>
          We are committed to protecting your privacy and complying with all
          applicable data protection and privacy laws, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Fiji Constitution 2013, Clause 24</strong> &mdash; the
            right to personal privacy, including confidentiality of personal
            information.
          </li>
          <li>
            <strong>Fiji Online Safety Act 2018 (Act No. 8 of 2018)</strong>{" "}
            &mdash; promotes responsible online behaviour and a safe online
            environment, administered by the Online Safety Commission Fiji
            (OSC).
          </li>
          <li>
            <strong>EU General Data Protection Regulation (GDPR)</strong> &mdash;
            for visitors in the European Economic Area.
          </li>
          <li>
            <strong>California Consumer Privacy Act (CCPA)</strong> &mdash; for
            residents of California, USA.
          </li>
        </ul>
        <p>
          <em>Note:</em> Fiji does not currently have a standalone
          comprehensive data protection statute. A Data Protection Bill is under
          development. In the interim, privacy protections derive from the
          constitutional right to privacy and the Online Safety Act 2018. We
          have voluntarily adopted GDPR-aligned practices to ensure strong
          protection regardless of the visitor&rsquo;s location.
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "2. Data We Collect",
    body: (
      <>
        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          2.1 Data you provide directly
        </h3>
        <p>When you submit our contact form, we collect:</p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>Your name</li>
          <li>Your email address</li>
          <li>The service you&rsquo;re interested in (optional)</li>
          <li>Your approximate budget (optional)</li>
          <li>Your project message or inquiry</li>
        </ul>
        <p>
          This data is stored in our database so we can respond to your inquiry
          and reference it if we begin a working relationship.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          2.2 Data collected automatically
        </h3>
        <p>
          When you visit the Site, we automatically collect limited technical
          data through Vercel Analytics:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>Page views and visit timestamps</li>
          <li>Approximate geographic region (country-level, derived from IP)</li>
          <li>Referrer (the page you came from)</li>
          <li>Browser and device type</li>
        </ul>
        <p>
          Vercel Analytics is privacy-friendly and does <strong>not</strong> use
          cookies or collect personally identifying information. IP addresses are
          not stored &mdash; only country-level geography is derived and the raw IP
          is discarded.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          2.3 Admin authentication data
        </h3>
        <p>
          When an N2K Labs administrator logs in to the dashboard, a session
          cookie (<code className="text-[var(--accent)]">n2k_session</code>) is
          set. This cookie contains a cryptographic hash of the admin password
          &mdash; it does <strong>not</strong> contain the password itself and
          cannot be used to recover it. The cookie expires after 7 days.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-data",
    title: "3. How We Use Your Data",
    body: (
      <>
        <p>We use the data we collect for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Responding to inquiries</strong> &mdash; to reply to your
            contact form submission and discuss potential projects.
          </li>
          <li>
            <strong>Providing services</strong> &mdash; if we begin a working
            relationship, your contact details are used for project
            communication and delivery.
          </li>
          <li>
            <strong>Improving the Site</strong> &mdash; aggregated, anonymized
            analytics help us understand which content is useful and how the
            Site performs.
          </li>
          <li>
            <strong>Legal compliance</strong> &mdash; retaining records as
            required by law or for legitimate business purposes.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> use your data for targeted advertising,
          profiling, or sale to third parties.
        </p>

        <h3 className="text-lg font-semibold text-[#f0ece6] mt-6 mb-3">
          Legal basis (GDPR)
        </h3>
        <p>
          For visitors in the European Economic Area, our lawful bases for
          processing are:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Consent</strong> (Article 6(1)(a)) &mdash; you voluntarily
            submit your contact details.
          </li>
          <li>
            <strong>Legitimate interests</strong> (Article 6(1)(f)) &mdash;
            responding to inquiries and operating the Site.
          </li>
          <li>
            <strong>Legal obligation</strong> (Article 6(1)(c)) &mdash; retaining
            records where required by law.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "4. Third-Party Processors",
    body: (
      <>
        <p>
          We do not sell your data. We do share it with the following
          third-party service providers who help us operate the Site:
        </p>
        <div className="space-y-4 mt-4">
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="font-semibold text-[#f0ece6] mb-1">
              Turso (libSQL)
            </div>
            <p className="text-sm text-[#8a8a93]">
              Database hosting. Stores contact form submissions and project
              data. Servers in AWS Tokyo (ap-northeast-1).
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="font-semibold text-[#f0ece6] mb-1">
              Vercel Inc.
            </div>
            <p className="text-sm text-[#8a8a93]">
              Website hosting and analytics. Processes HTTP requests and
              collects anonymized page-view data. Global edge network.
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="font-semibold text-[#f0ece6] mb-1">
              Resend, Inc.
            </div>
            <p className="text-sm text-[#8a8a93]">
              Email delivery. Used to send contact form submissions to our team
              inbox. Your email address is included in the message so we can
              reply.
            </p>
          </div>
        </div>
        <p className="mt-4">
          Each processor is bound by data protection agreements and only handles
          your data to provide services on our behalf.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies",
    body: (
      <>
        <p>The Site uses minimal cookies:</p>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="text-left p-3 font-semibold text-[#f0ece6]">Cookie</th>
                <th className="text-left p-3 font-semibold text-[#f0ece6]">Purpose</th>
                <th className="text-left p-3 font-semibold text-[#f0ece6]">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-3 font-mono text-[var(--accent)]">n2k_session</td>
                <td className="p-3 text-[#8a8a93]">Admin dashboard authentication</td>
                <td className="p-3 text-[#8a8a93]">7 days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          We do <strong>not</strong> use advertising cookies, tracking pixels,
          or third-party analytics cookies. Vercel Analytics is cookieless.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    body: (
      <>
        <p>
          We retain contact form submissions for as long as necessary to fulfill
          the purpose for which they were collected:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Inquiries that do not lead to a project:</strong> retained
            for 24 months, then deleted.
          </li>
          <li>
            <strong>Inquiries that lead to a project:</strong> retained for the
            duration of the working relationship and 7 years thereafter for
            record-keeping purposes.
          </li>
          <li>
            <strong>Analytics data:</strong> aggregated and anonymized; retained
            indefinitely.
          </li>
        </ul>
        <p>
          You may request early deletion of your data at any time (see Your
          Rights below).
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    body: (
      <>
        <p>
          Depending on your jurisdiction, you may have the following rights over
          your personal data:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Right of access</strong> &mdash; request a copy of the data
            we hold about you.
          </li>
          <li>
            <strong>Right to rectification</strong> &mdash; request correction
            of inaccurate data.
          </li>
          <li>
            <strong>Right to erasure</strong> &mdash; request deletion of your
            data (&ldquo;right to be forgotten&rdquo;).
          </li>
          <li>
            <strong>Right to data portability</strong> &mdash; receive your data
            in a machine-readable format.
          </li>
          <li>
            <strong>Right to object</strong> &mdash; object to processing based
            on legitimate interests.
          </li>
          <li>
            <strong>Right to withdraw consent</strong> &mdash; withdraw consent
            at any time (does not affect prior processing).
          </li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, email us at{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-[var(--accent)] hover:underline"
          >
            {siteConfig.email}
          </a>
          . We will respond within 30 days.
        </p>
        <p className="mt-4">
          If you are unsatisfied with our response, you have the right to lodge a
          complaint with your local data protection authority.
        </p>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "8. International Data Transfers",
    body: (
      <>
        <p>
          Your data may be processed in countries other than your country of
          residence:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            <strong>Database (Turso):</strong> AWS Tokyo region
            (ap-northeast-1).
          </li>
          <li>
            <strong>Hosting (Vercel):</strong> global edge network; requests
            served from the nearest data center.
          </li>
          <li>
            <strong>Email (Resend):</strong> United States.
          </li>
        </ul>
        <p className="mt-4">
          Where data is transferred outside your jurisdiction, we rely on
          appropriate safeguards such as Standard Contractual Clauses (SCCs) or
          the recipient&rsquo;s participation in an approved certification
          framework.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "9. Security",
    body: (
      <>
        <p>
          We take reasonable technical and organizational measures to protect
          your data:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-[var(--accent)]">
          <li>
            HTTPS encryption for all data in transit (enforced via HSTS).
          </li>
          <li>
            Content Security Policy (CSP) to prevent injection attacks.
          </li>
          <li>
            Rate limiting and input validation on all API endpoints.
          </li>
          <li>
            Admin authentication via cryptographically hashed session tokens.
          </li>
          <li>
            Encrypted at rest by our infrastructure providers (Turso, Vercel).
          </li>
        </ul>
        <p className="mt-4">
          No method of transmission or storage is 100% secure. If a data breach
          occurs that poses a risk to your rights, we will notify you and the
          relevant authorities as required by law.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "10. Children\u2019s Privacy",
    body: (
      <>
        <p>
          The Site is not directed to children under 13, and we do not knowingly
          collect personal data from children. If you believe a child has
          provided us with personal data, please contact us and we will delete
          it promptly.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time, particularly when
          Fiji&rsquo;s Data Protection Bill is enacted into law. The
          &ldquo;Last updated&rdquo; date at the top of this page indicates when
          the policy was last revised. Material changes will be highlighted on
          the Site or communicated to you directly if we have your contact
          details.
        </p>
        <p>
          Continued use of the Site after changes take effect constitutes
          acceptance of the updated policy.
        </p>
      </>
    ),
  },
  {
    id: "fiji-legal-framework",
    title: "12. Fiji Legal Framework",
    body: (
      <>
        <p>
          As an operator based in Fiji, N2K Labs operates within the following
          national legal framework relevant to privacy and data handling:
        </p>
        <div className="space-y-4 mt-4">
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="font-semibold text-[#f0ece6] mb-1">
              Constitution of the Republic of Fiji 2013, Clause 24
            </div>
            <p className="text-sm text-[#8a8a93]">
              Recognises the right to personal privacy, including the right to
              confidentiality of personal information. This is the primary
              constitutional basis for privacy protection in Fiji.
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="font-semibold text-[#f0ece6] mb-1">
              Online Safety Act 2018 (Act No. 8 of 2018)
            </div>
            <p className="text-sm text-[#8a8a93]">
              Promotes responsible online behaviour and a safe online
              environment. Administered by the{" "}
              <a
                href="https://osc.com.fj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Online Safety Commission Fiji (OSC)
              </a>
              . The Act is currently under review, and we monitor amendments
              that affect data handling.
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="font-semibold text-[#f0ece6] mb-1">
              Fijian Competition and Consumer Commission Act 2010 (FCCCA)
            </div>
            <p className="text-sm text-[#8a8a93]">
              Provides consumer protection provisions that apply to our services
              when supplied to Fijian consumers. Administered by the Fijian
              Competition and Consumer Commission (FCCC).
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
            <div className="font-semibold text-[#f0ece6] mb-1">
              Electronic Transactions Act (as amended 2017)
            </div>
            <p className="text-sm text-[#8a8a93]">
              Gives legal recognition to electronic contracts, electronic
              signatures, and digital records. This Act validates contracts
              formed through our Site (including the contact form and Terms of
              Service acceptance).
            </p>
          </div>
          <div className="border border-white/10 rounded-lg p-4 bg-[var(--accent)]/[0.03]">
            <div className="font-semibold text-[var(--accent)] mb-1">
              Data Protection Bill (Pending)
            </div>
            <p className="text-sm text-[#8a8a93]">
              Fiji&rsquo;s comprehensive Data Protection Bill is currently under
              development. When enacted, it will introduce formal data
              controller/processor obligations, breach notification
              requirements, and enhanced data subject rights. We are monitoring
              its progress and will update this Policy to achieve full
              compliance when it takes effect.
            </p>
          </div>
        </div>
        <p className="mt-4">
          For cross-border visitors, we additionally comply with the EU GDPR and
          the California CCPA as described in this Policy. Where multiple laws
          apply, we apply the highest standard of protection.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "13. Contact Us",
    body: (
      <>
        <p>
          If you have questions about this Privacy Policy or how we handle your
          data, please contact us:
        </p>
        <div className="mt-4 border border-white/10 rounded-lg p-5 bg-white/[0.02] space-y-2">
          <div className="font-semibold text-[#f0ece6]">N2K Labs</div>
          <div className="text-sm text-[#8a8a93]">
            South Pacific, Fiji
          </div>
          <div className="text-xs text-[#8a8a93] mt-1">
            Currently operating as an unregistered sole proprietor
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

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal data."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  );
}
