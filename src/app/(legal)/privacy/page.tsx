import type { Metadata } from "next";
import Link from "next/link";

import { Fill, LegalDoc, LegalList, type LegalSection } from "@/components/legal/legal-doc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WizKraft collects, uses, shares and protects personal data, and the rights you have over it.",
};

const LAST_UPDATED = "2026-09-04";

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          WizKraft is an AI-powered agile workspace operated by{" "}
          <Fill>[Legal entity name]</Fill>, <Fill>[Registered address]</Fill>. This policy
          explains what personal data we handle, why, and what rights you have over it.
        </p>
        <p>
          Where you use WizKraft through a workspace created by your employer or another
          organisation, that organisation is the data controller for the content in that
          workspace and we act as its processor. This policy then describes how we process data
          on their behalf; their own privacy notice governs their decisions about it.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Data we collect",
    body: (
      <>
        <p>
          <strong className="font-medium text-foreground">You give us:</strong>
        </p>
        <LegalList
          items={[
            "Account data — name, email address, password (stored only as a hash), phone number where you provide one, and your role and team size from onboarding.",
            "Workspace content — projects, tickets, documents, prompts, files and comments you create or upload.",
            "Billing data — plan, billing address and tax details. Card details go directly to our payment processor; we never receive or store full card numbers.",
            "Support data — the messages and any attachments you send us.",
          ]}
        />
        <p>
          <strong className="font-medium text-foreground">We collect automatically:</strong>
        </p>
        <LegalList
          items={[
            "Usage data — features used, actions taken, credits consumed, and timestamps.",
            "Device and log data — IP address, browser and operating system, and error diagnostics.",
            "Cookies and similar technologies, as described below.",
          ]}
        />
        <p>
          <strong className="font-medium text-foreground">We receive from others:</strong>{" "}
          where you sign in with Google, Microsoft, GitHub or LinkedIn, that provider sends us
          your name, email address and profile image. We do not receive your password.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use data",
    body: (
      <LegalList
        items={[
          "To provide the Service — creating your account, running workspaces, and generating AI output from your prompts and content.",
          "To bill you and to prevent payment fraud.",
          "To support you, and to communicate about the Service, including security and change notices.",
          "To secure the Service — detecting abuse, debugging failures, and maintaining backups.",
          "To improve the Service, using aggregated or de-identified usage data.",
          "To send marketing, only where you have opted in, and you can withdraw at any time.",
          "To comply with legal obligations and to establish or defend legal claims.",
        ]}
      />
    ),
  },
  {
    id: "ai-processing",
    title: "AI processing",
    body: (
      <>
        <p>
          When you use an AI feature, the prompt and the content needed to answer it are sent to a
          model provider acting as our sub-processor. We contractually require that:
        </p>
        <LegalList
          items={[
            "Your content is not used to train their foundation models.",
            "Content is retained only as long as needed to return a result and meet limited abuse-monitoring obligations.",
            "Processing is subject to confidentiality and security terms at least as protective as this policy.",
          ]}
        />
        <p>
          Our current model providers are <Fill>[list model providers]</Fill>. We keep a current
          list of sub-processors at <Fill>[sub-processor list URL]</Fill> and give notice before
          adding one.
        </p>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal bases (UK/EU)",
    body: (
      <>
        <p>
          Where the UK GDPR or EU GDPR applies, we rely on these bases:
        </p>
        <LegalList
          items={[
            "Performance of a contract — to provide the Service and bill for it.",
            "Legitimate interests — to secure and improve the Service, and to prevent fraud and abuse, balanced against your rights.",
            "Consent — for optional cookies and marketing, which you may withdraw at any time.",
            "Legal obligation — for tax, accounting and lawful requests.",
          ]}
        />
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing and disclosure",
    body: (
      <>
        <p>We do not sell personal data. We share it only with:</p>
        <LegalList
          items={[
            "Service providers acting on our instructions — hosting, model providers, payment processing, email delivery, error monitoring and analytics.",
            "Other members of your workspace, who can see the content you contribute to it, and workspace administrators, who can access, export and delete it.",
            "Authorities or others where required by law, or to protect our rights, users or the security of the Service.",
            "A buyer or successor, if we are involved in a merger, acquisition or asset sale — we will give notice before your data becomes subject to a different policy.",
          ]}
        />
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        We and our providers may process data in countries other than yours, including the{" "}
        <Fill>[list primary processing regions]</Fill>. Where data leaves the UK or EEA we rely
        on an adequacy decision, or on Standard Contractual Clauses with appropriate safeguards.
        You can request a copy of the safeguards using the contact details below.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Retention",
    body: (
      <LegalList
        items={[
          "Workspace content is kept while the workspace is active. Deleted content is removed from live systems promptly and purged from backups within 30 days.",
          "Account data is deleted within 30 days of account deletion, except where we must keep it longer by law.",
          "Billing records are kept for the period required by tax law, typically 6–7 years.",
          "Logs are retained for up to 12 months.",
        ]}
      />
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        We protect data with encryption in transit and at rest, role-based access control,
        least-privilege access for staff, audit logging, and regular backups. No service can be
        perfectly secure, but we will notify you and any regulator as required by law if a breach
        affects your personal data.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to access your data, correct it,
          delete it, restrict or object to processing, receive it in a portable format, and
          withdraw consent. Where the CCPA/CPRA applies, you also have the right to know what we
          collect, to delete it, to correct it, and not to be discriminated against for
          exercising those rights. We do not sell or share personal data for cross-context
          behavioural advertising.
        </p>
        <p>
          To exercise a right, email <Fill>privacy@wizkraft.ai</Fill>. We respond within 30 days.
          If your data sits in a workspace controlled by an organisation, we will refer your
          request to them. You may also complain to your data protection authority — in the UK,
          the Information Commissioner&rsquo;s Office.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>We use:</p>
        <LegalList
          items={[
            "Strictly necessary cookies — to keep you signed in and to keep the Service secure. These cannot be turned off.",
            "Preference cookies — to remember choices such as theme.",
            "Analytics cookies — to understand how the Service is used, set only with your consent where consent is required.",
          ]}
        />
        <p>
          You can clear or block cookies in your browser, though the Service may not work
          correctly without the necessary ones.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        The Service is not directed to children under 16, and we do not knowingly collect their
        personal data. If you believe a child has given us data, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy. We will change the &ldquo;last updated&rdquo; date above and,
        where a change is material, give notice by email or in the Service before it takes
        effect.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Privacy questions or requests: <Fill>privacy@wizkraft.ai</Fill>. Our data protection
        contact is <Fill>[DPO or privacy contact name]</Fill> at{" "}
        <Fill>[Registered address]</Fill>. See also our{" "}
        <Link href="/terms" className="text-foreground underline underline-offset-4">
          Terms of Service
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      summary="What personal data WizKraft handles, why we handle it, and the control you have over it."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  );
}
