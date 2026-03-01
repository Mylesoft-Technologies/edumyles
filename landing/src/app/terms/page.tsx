import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal — EduMyles",
  description: "Terms of Service, Privacy Policy, and legal information for EduMyles.",
};

const sections = [
  {
    id: "terms",
    title: "Terms of Service",
    content: `By accessing or using EduMyles ("the Platform"), you agree to be bound by these Terms of Service. EduMyles is a school management platform operated by Mylesoft Technologies Ltd ("we", "us", "our"), registered in Nairobi, Kenya.

You may use the Platform solely for lawful purposes related to school administration, student management, and related educational operations. You must not use the Platform to violate any applicable law, infringe intellectual property rights, or transmit harmful content.

We reserve the right to suspend or terminate accounts that violate these terms. All data you upload to EduMyles remains your property. We act as a data processor on your behalf.

Subscription fees are billed monthly or annually as indicated on your plan. Free-tier accounts may be subject to usage limits. We reserve the right to update pricing with 30 days' notice.`,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    content: `EduMyles collects personal information necessary to provide our services, including names, email addresses, school information, student records, and payment details.

We use your data to: (1) provide and improve the Platform, (2) process payments, (3) communicate with you about your account, and (4) comply with legal obligations.

We do not sell personal data to third parties. Data may be shared with: payment processors (Stripe, M-Pesa, Airtel Money), authentication providers (WorkOS), and infrastructure providers (Vercel, Convex) solely to operate the Platform.

Data is stored securely with encryption at rest and in transit. We implement role-based access controls and audit logging to protect your information. You have the right to access, correct, or delete your personal data by contacting us at privacy@edumyles.com.`,
  },
  {
    id: "security",
    title: "Security",
    content: `EduMyles implements industry-standard security measures to protect your data:

- All data is encrypted in transit (TLS 1.3) and at rest
- Role-based access control (RBAC) with 13 distinct roles and granular permissions
- Multi-tenant architecture with strict data isolation between schools
- Authentication via WorkOS with support for SSO, MFA, and OAuth
- Regular security audits and vulnerability assessments
- Audit logging for all administrative actions
- Secure API endpoints with rate limiting and input validation

For security concerns, contact security@edumyles.com.`,
  },
  {
    id: "compliance",
    title: "Compliance",
    content: `EduMyles is committed to compliance with applicable data protection regulations:

- Kenya Data Protection Act, 2019 — We comply with the requirements of Kenya's data protection framework, including lawful processing, data minimization, and cross-border transfer safeguards.
- GDPR — For users in the European Economic Area, we provide GDPR-compliant data processing, including rights to access, rectification, erasure, and data portability.
- Children's Data — As an education platform, we take extra care with student data. Schools act as data controllers and must ensure appropriate consent is obtained from parents or guardians.

For compliance inquiries, contact compliance@edumyles.com.`,
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    content: `EduMyles uses cookies and similar technologies to:

- Essential Cookies: Maintain your login session and security preferences. These cannot be disabled.
- Analytics Cookies: Help us understand how the Platform is used so we can improve it. These are optional and can be disabled.

We do not use advertising cookies or tracking pixels. You can manage cookie preferences through your browser settings. Disabling essential cookies may prevent the Platform from functioning correctly.`,
  },
  {
    id: "gdpr",
    title: "GDPR Compliance",
    content: `Under the General Data Protection Regulation (GDPR), you have the following rights:

- Right to Access — Request a copy of all personal data we hold about you
- Right to Rectification — Correct inaccurate personal data
- Right to Erasure — Request deletion of your personal data
- Right to Restrict Processing — Limit how we use your data
- Right to Data Portability — Receive your data in a machine-readable format
- Right to Object — Object to processing based on legitimate interests

To exercise any of these rights, email privacy@edumyles.com. We will respond within 30 days.

Our legal basis for processing data is: (a) performance of a contract (providing the service), (b) legitimate interests (improving the platform), and (c) legal obligations (tax, regulatory compliance).`,
  },
  {
    id: "ipr",
    title: "Intellectual Property",
    content: `All intellectual property rights in the EduMyles platform — including software, design, logos, documentation, and APIs — are owned by Mylesoft Technologies Ltd.

You retain all rights to data you upload to the Platform. By using EduMyles, you grant us a limited license to process your data solely to provide the service.

If you believe any content on EduMyles infringes your intellectual property rights, please contact legal@edumyles.com with details of the alleged infringement.`,
  },
  {
    id: "anti-spam",
    title: "Anti-spam Policy",
    content: `EduMyles does not send unsolicited communications. All emails and SMS messages sent through the Platform are initiated by authorized school administrators for legitimate educational purposes.

We comply with anti-spam regulations including the CAN-SPAM Act and applicable local laws. All marketing communications include unsubscribe options. Abuse of the Platform's communication features will result in account suspension.

To report spam, contact abuse@edumyles.com.`,
  },
  {
    id: "trademark",
    title: "Trademark Policy",
    content: `"EduMyles" and the EduMyles logo are trademarks of Mylesoft Technologies Ltd. Use of our trademarks requires prior written consent.

Partners and affiliates may use EduMyles branding in accordance with our brand guidelines, available upon request. Unauthorized use of our trademarks may result in legal action.`,
  },
  {
    id: "abuse",
    title: "Abuse Policy",
    content: `EduMyles has zero tolerance for abuse of the Platform. Prohibited activities include:

- Uploading malicious software or content
- Attempting to access other users' data without authorization
- Using the Platform for any illegal purpose
- Harassing or threatening other users
- Circumventing security measures or access controls

Violations will result in immediate account suspension and may be reported to law enforcement. To report abuse, contact abuse@edumyles.com.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", marginBottom: "0.5rem" }}>
        Legal
      </h1>
      <p style={{ color: "#6b6b6b", marginBottom: "2rem" }}>
        Last updated: March 2026
      </p>

      {/* Quick Navigation */}
      <nav
        style={{
          background: "#F8F8F8",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Contents</h3>
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                style={{
                  color: "#056C40",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections */}
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          style={{
            marginBottom: "3rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
            {section.title}
          </h2>
          {section.content.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                color: "#333",
                lineHeight: 1.7,
                marginBottom: "0.75rem",
                fontSize: "0.95rem",
                whiteSpace: "pre-line",
              }}
            >
              {para}
            </p>
          ))}
        </section>
      ))}

      {/* Contact */}
      <div
        style={{
          background: "#F8F8F8",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          Questions about our policies?
        </h3>
        <p style={{ color: "#6b6b6b", marginBottom: "1rem" }}>
          Contact our legal team for any questions or concerns.
        </p>
        <a
          href="mailto:legal@edumyles.com"
          className="btn btn-primary"
        >
          Contact Legal Team
        </a>
      </div>
    </div>
  );
}
