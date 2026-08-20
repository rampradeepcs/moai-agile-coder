import { members, projects } from "./data";

/** Workspace-level (cross-project) mock data for the global screens. */

// ——— Credits / usage ————————————————————————————————————————————————

export const creditBalance = {
  total: 200000,
  used: 159480,
  remaining: 40520,
  refreshOn: "Jul 01, 2026",
};

/** Per-project allocation + burn, keyed by project slug. */
export const projectUsage = projects.map((p) => ({
  slug: p.slug,
  name: p.name,
  allocated: p.tokensAssigned,
  used: p.tokensUsed,
  members: p.memberIds.length,
  llm: p.llm,
  status: p.status,
}));

export const userUsage = [
  { memberId: "u1", credits: 12976, share: 22, projects: ["paw-care", "skin-care"] },
  { memberId: "u2", credits: 8987, share: 15, projects: ["paw-care", "fit-coach"] },
  { memberId: "u3", credits: 2726, share: 5, projects: ["paw-care", "skin-care"] },
  { memberId: "u4", credits: 3290, share: 6, projects: ["paw-care", "skin-care"] },
  { memberId: "u5", credits: 1373, share: 2, projects: ["paw-care", "fit-coach"] },
  { memberId: "u6", credits: 812, share: 1, projects: ["paw-care"] },
  { memberId: "a1", credits: 9840, share: 17, projects: ["paw-care", "fit-coach"] },
  { memberId: "a5", credits: 7420, share: 13, projects: ["skin-care"] },
  { memberId: "a7", credits: 6110, share: 10, projects: ["paw-care"] },
  { memberId: "a9", credits: 5230, share: 9, projects: ["paw-care", "skin-care"] },
];

export const usageTrend = [
  { month: "Jan", "paw-care": 6200, "skin-care": 1800, "fit-coach": 2400 },
  { month: "Feb", "paw-care": 9800, "skin-care": 2600, "fit-coach": 4100 },
  { month: "Mar", "paw-care": 12400, "skin-care": 3100, "fit-coach": 6800 },
  { month: "Apr", "paw-care": 16900, "skin-care": 4000, "fit-coach": 9200 },
  { month: "May", "paw-care": 21800, "skin-care": 4900, "fit-coach": 12600 },
  { month: "Jun", "paw-care": 30180, "skin-care": 5000, "fit-coach": 14700 },
];

// ——— Subscription ————————————————————————————————————————————————————

export const currentPlan = {
  id: "pro",
  name: "Pro",
  seats: 17,
  seatLimit: 25,
  renewsOn: "Sep 05, 2026",
  monthlyPrice: 49,
  includedCredits: 200000,
  paymentMethod: { brand: "Visa", last4: "6411", expires: "08/28" },
};

export const plans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    yearly: 0,
    credits: "20k credits / mo",
    tagline: "For trying out AI-native delivery",
    features: ["2 projects", "5 seats", "Community support", "Core AI agents"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 49,
    yearly: 39,
    credits: "200k credits / mo",
    tagline: "For teams shipping every sprint",
    features: ["Unlimited projects", "25 seats", "All 11 AI agents", "Priority support", "Usage analytics"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    yearly: null,
    credits: "Custom credits",
    tagline: "Security, scale and control",
    features: ["Unlimited seats", "SSO / SAML", "Dedicated agents", "Audit logs", "Custom LLM endpoints"],
  },
] as const;

export const invoices = [
  { id: "INV-2026-0806", date: "Aug 05, 2026", amount: 49, status: "paid", period: "Aug 2026" },
  { id: "INV-2026-0705", date: "Jul 05, 2026", amount: 49, status: "paid", period: "Jul 2026" },
  { id: "INV-2026-0605", date: "Jun 05, 2026", amount: 79, status: "paid", period: "Jun 2026 + credit pack" },
  { id: "INV-2026-0505", date: "May 05, 2026", amount: 49, status: "paid", period: "May 2026" },
  { id: "INV-2026-0405", date: "Apr 05, 2026", amount: 49, status: "refunded", period: "Apr 2026" },
] as const;

// ——— Credit packs ————————————————————————————————————————————————————

export const creditPacks = [
  { id: "pack-50", credits: 50000, price: 25, perK: 0.5 },
  { id: "pack-150", credits: 150000, price: 60, perK: 0.4, popular: true },
  { id: "pack-500", credits: 500000, price: 150, perK: 0.3 },
] as const;

export const creditHistory = [
  { date: "Jun 03, 2026", label: "Monthly plan refresh", amount: +200000 },
  { date: "Jun 01, 2026", label: "Credit pack purchase", amount: +150000 },
  { date: "May 28, 2026", label: "Paw care — story generation", amount: -12400 },
  { date: "May 21, 2026", label: "Fit coach — design document", amount: -8900 },
  { date: "May 14, 2026", label: "Skin care — AI chat", amount: -5210 },
] as const;

// ——— Settings ————————————————————————————————————————————————————————

export const workspace = {
  name: "Moai Consulting",
  url: "moai-consulting",
  timezone: "Asia/Kolkata (GMT+5:30)",
  language: "English (US)",
  weekStart: "Monday",
};

export const skills = [
  { id: "requirements", name: "Requirement drafting", desc: "Turns a product idea into structured requirement documents.", agent: "Nava", enabled: true },
  { id: "ia", name: "Information architecture", desc: "Generates sitemaps and user-flow maps from requirements.", agent: "Carter", enabled: true },
  { id: "concept", name: "Concept design", desc: "Produces moodboards and visual directions for review.", agent: "Sirus", enabled: true },
  { id: "stories", name: "Epic & story generation", desc: "Breaks requirements into epics, stories and estimated tasks.", agent: "Zara", enabled: true },
  { id: "components", name: "Component engineering", desc: "Implements design-system components from specs.", agent: "Orion", enabled: false },
  { id: "api", name: "API scaffolding", desc: "Drafts API contracts and database schemas.", agent: "Quasar", enabled: false },
  { id: "qa", name: "Test authoring", desc: "Writes test plans and regression scripts for completed work.", agent: "Lumi", enabled: true },
  { id: "release", name: "Release notes", desc: "Summarises shipped work into release notes each sprint.", agent: "Echo", enabled: false },
];

export const connectors = [
  { id: "github", name: "GitHub", desc: "Sync branches, PRs and deployment status to tasks.", connected: true, account: "moai-consulting" },
  { id: "figma", name: "Figma", desc: "Attach frames to stories and keep design links fresh.", connected: true, account: "khalil@moaiconsulting.co.in" },
  { id: "slack", name: "Slack", desc: "Send sprint updates and AI-activity alerts to channels.", connected: false, account: null },
  { id: "jira", name: "Jira", desc: "Two-way sync of issues for teams migrating gradually.", connected: false, account: null },
  { id: "gdrive", name: "Google Drive", desc: "Store generated documents in your shared drive.", connected: true, account: "moaiconsulting.co.in" },
  { id: "sentry", name: "Sentry", desc: "Create bugs automatically from new error groups.", connected: false, account: null },
];

export const memberCount = members.filter((m) => m.kind === "human").length;
export const agentCount = members.filter((m) => m.kind === "agent").length;
