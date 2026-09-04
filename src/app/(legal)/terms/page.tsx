import type { Metadata } from "next";
import Link from "next/link";

import { Fill, LegalDoc, LegalList, type LegalSection } from "@/components/legal/legal-doc";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of WizKraft, our AI-powered agile workspace.",
};

const LAST_UPDATED = "2026-09-04";

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    body: (
      <>
        <p>
          These Terms of Service (the &ldquo;Terms&rdquo;) are a binding agreement between you
          and <Fill>[Legal entity name]</Fill> (&ldquo;WizKraft&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;), registered at <Fill>[Registered address]</Fill>. They govern your
          access to and use of the WizKraft web application, APIs and related services (the
          &ldquo;Service&rdquo;).
        </p>
        <p>
          By creating an account, accepting an invitation to a workspace, or otherwise using the
          Service, you agree to these Terms. If you are agreeing on behalf of an organisation,
          you confirm you have authority to bind that organisation, and &ldquo;you&rdquo; means
          that organisation.
        </p>
        <p>
          If you do not agree to these Terms, do not use the Service.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts and eligibility",
    body: (
      <>
        <p>
          You must be at least 16 years old, and legally able to enter a contract, to use the
          Service. You are responsible for the accuracy of the information on your account and
          for keeping your credentials secure.
        </p>
        <LegalList
          items={[
            "You are responsible for all activity that occurs under your account.",
            "Do not share credentials, and notify us promptly if you believe an account has been compromised.",
            "We may suspend an account where we reasonably believe it has been compromised or is being used in breach of these Terms.",
          ]}
        />
      </>
    ),
  },
  {
    id: "workspaces",
    title: "Workspaces, roles and administrators",
    body: (
      <>
        <p>
          The Service is organised into workspaces. The person who creates a workspace, and any
          administrator they appoint, controls that workspace: they can invite and remove
          members, assign roles, change settings, and access, export or delete content within it.
        </p>
        <p>
          If you join a workspace created by someone else, that organisation — not you — is the
          controller of the workspace and its content. Your use may also be subject to that
          organisation&rsquo;s own policies.
        </p>
      </>
    ),
  },
  {
    id: "plans",
    title: "Plans, credits and billing",
    body: (
      <>
        <p>
          Paid plans and credit bundles are described at the point of purchase. Unless stated
          otherwise there:
        </p>
        <LegalList
          items={[
            "Subscription fees are billed in advance for the billing period you select and renew automatically until cancelled.",
            "You can cancel at any time; cancellation takes effect at the end of the current billing period, and the Service remains available until then.",
            "Fees are exclusive of taxes, which are added where required.",
            "Credits consumed by AI features are deducted as used, may expire as stated at purchase, and are not redeemable for cash.",
            "We may change pricing on renewal, with reasonable notice before the change takes effect.",
          ]}
        />
        <p>
          Except where required by law, fees already paid are non-refundable. Failure to pay may
          result in suspension of access.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to use the Service to:</p>
        <LegalList
          items={[
            "Break the law, infringe intellectual property, or violate anyone's privacy rights.",
            "Upload malware, or attempt to gain unauthorised access to the Service, other accounts, or the systems of any third party.",
            "Interfere with or place unreasonable load on the Service, including by circumventing rate limits or usage quotas.",
            "Reverse engineer the Service, or use it to build a directly competing product.",
            "Generate or distribute content that is unlawful, harassing, deceptive, or that presents AI output as human-authored where doing so would mislead materially.",
            "Resell or provide the Service to third parties except as expressly permitted.",
          ]}
        />
      </>
    ),
  },
  {
    id: "your-content",
    title: "Your content",
    body: (
      <>
        <p>
          You retain all rights to the content you submit to the Service — projects, tickets,
          documents, files and other material (&ldquo;Your Content&rdquo;). We claim no ownership
          of it.
        </p>
        <p>
          You grant us a worldwide, non-exclusive, royalty-free licence to host, store, copy,
          transmit, display and process Your Content strictly to the extent needed to operate,
          secure and support the Service for you. This licence ends when Your Content is deleted,
          save for backups retained for the period described in our{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          You are responsible for having the rights necessary to submit Your Content and for its
          legality.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI features and output",
    body: (
      <>
        <p>
          The Service uses AI models — our own and those of third-party providers — to generate
          documents, plan work, and act on tickets. Output is generated probabilistically.
        </p>
        <LegalList
          items={[
            "Output may be inaccurate, incomplete, or unsuitable for your purpose. Review it before relying on it, and never rely on it as legal, financial, medical or other professional advice.",
            "Similar prompts may produce similar output for other customers, so output is not guaranteed to be unique to you.",
            "As between you and us, and to the extent permitted by law, you own the output generated from your prompts and Your Content.",
            "You are responsible for how output is used, including any review or disclosure obligations that apply to you.",
          ]}
        />
        <p>
          We do not use Your Content to train foundation models, and we require that the
          third-party model providers we use do not either. The providers we use are listed in
          our{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "our-ip",
    title: "Our intellectual property",
    body: (
      <p>
        The Service — including its software, design, brand and documentation — is owned by us
        and our licensors and is protected by intellectual property law. We grant you a limited,
        non-exclusive, non-transferable, revocable right to use the Service in accordance with
        these Terms. No other rights are granted. Feedback you send us may be used without
        obligation to you.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: (
      <p>
        The Service integrates with third-party products, such as identity providers and code
        hosts. Your use of those products is governed by their own terms, and we are not
        responsible for them. Disabling an integration may affect Service functionality.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Availability and changes",
    body: (
      <p>
        We aim to keep the Service available and improve it over time, and we may add, change or
        remove features. Where a change materially reduces core functionality on a paid plan, we
        will give reasonable notice. We may carry out maintenance, and may suspend access where
        needed to protect the Service, its users, or to comply with law.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <p>
        Except as expressly stated in these Terms and to the fullest extent permitted by law, the
        Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties
        of any kind, whether express, implied or statutory, including implied warranties of
        merchantability, fitness for a particular purpose, and non-infringement. We do not warrant
        that the Service will be uninterrupted or error-free, or that AI output will be accurate.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, neither party is liable for indirect,
          incidental, special, consequential or punitive damages, or for lost profits, revenue,
          goodwill or data, however caused.
        </p>
        <p>
          Our total aggregate liability arising out of or relating to the Service in any 12-month
          period will not exceed the greater of the amounts you paid us for the Service in that
          period, or <Fill>[cap for free-tier users, e.g. USD 100]</Fill>.
        </p>
        <p>
          Nothing in these Terms excludes liability that cannot be excluded by law, including for
          death or personal injury caused by negligence, or for fraud.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnification",
    body: (
      <p>
        You will indemnify and hold us harmless against third-party claims, damages and
        reasonable costs arising from Your Content or your use of the Service in breach of these
        Terms, except to the extent the claim arises from our own breach or negligence.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Term and termination",
    body: (
      <>
        <p>
          These Terms apply for as long as you use the Service. You may stop at any time and
          delete your account from settings. We may suspend or terminate access if you materially
          breach these Terms and, where the breach can be fixed, do not fix it within 30 days of
          notice — or immediately where the breach is unlawful or poses a risk to the Service or
          other users.
        </p>
        <p>
          On termination, your right to use the Service ends. You can export Your Content before
          termination, and we will delete it in line with our{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          . Sections that by their nature should survive — ownership, disclaimers, liability,
          indemnity and governing law — do so.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these Terms. If a change is material we will give notice — by email or in
        the Service — at least 30 days before it takes effect, unless the change is required by
        law or addresses a security issue. Continuing to use the Service after a change takes
        effect means you accept the updated Terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <p>
        These Terms are governed by the laws of <Fill>[Governing jurisdiction]</Fill>, without
        regard to conflict-of-law rules, and the courts of{" "}
        <Fill>[Exclusive venue]</Fill> have exclusive jurisdiction, except that either party may
        seek injunctive relief where necessary to protect its intellectual property. Nothing here
        removes consumer rights to bring proceedings in your country of residence where the law
        gives you that right.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these Terms: <Fill>legal@wizkraft.ai</Fill>, or write to us at{" "}
        <Fill>[Registered address]</Fill>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      summary="The rules for using WizKraft — what you can expect from us, and what we ask of you."
      lastUpdated={LAST_UPDATED}
      sections={SECTIONS}
    />
  );
}
