import type {
  ActivityEvent,
  Member,
  Notification,
  Pipeline,
  Project,
  Sprint,
  WorkItem,
} from "./types";

export const members: Member[] = [
  { id: "u1", name: "Ram Pradeep", role: "Team lead", email: "ram@moaiconsulting.co.in", kind: "human", color: "#7c5cff" },
  { id: "u2", name: "Venkat Goddam", role: "Senior project manager", email: "venkat@moaiconsulting.co.in", kind: "human", color: "#22b07d" },
  { id: "u3", name: "Akalya V", role: "Senior UXI designer", email: "akalya@moaiconsulting.co.in", kind: "human", color: "#e8a33d" },
  { id: "u4", name: "Ragul S", role: "Frontend engineer", email: "ragul@moaiconsulting.co.in", kind: "human", color: "#e25c5c" },
  { id: "u5", name: "Kowsik R", role: "Backend engineer", email: "kowsik@moaiconsulting.co.in", kind: "human", color: "#3d8de8" },
  { id: "u6", name: "Deepthi M", role: "QA engineer", email: "deepthi@moaiconsulting.co.in", kind: "human", color: "#c85ce2" },
  // AI agents — assignable to stages and work items
  { id: "a1", name: "Nava", role: "Sr Project manager agent", email: "nava@agents.agilecoder.app", kind: "agent", color: "#8b7cf6" },
  { id: "a2", name: "Zara", role: "Project coordinator agent", email: "zara@agents.agilecoder.app", kind: "agent", color: "#7cb8f6" },
  { id: "a3", name: "Pixel", role: "Research agent", email: "pixel@agents.agilecoder.app", kind: "agent", color: "#f67cb8" },
  { id: "a4", name: "Carter", role: "IA agent", email: "carter@agents.agilecoder.app", kind: "agent", color: "#7cf6d4" },
  { id: "a5", name: "Echo", role: "Design agent", email: "echo@agents.agilecoder.app", kind: "agent", color: "#f6d47c" },
  { id: "a6", name: "Sirus", role: "Concept design agent", email: "sirus@agents.agilecoder.app", kind: "agent", color: "#b87cf6" },
  { id: "a7", name: "Orion", role: "Component engineer agent", email: "orion@agents.agilecoder.app", kind: "agent", color: "#7cf68b" },
  { id: "a8", name: "Astra", role: "Architecture agent", email: "astra@agents.agilecoder.app", kind: "agent", color: "#f6a57c" },
  { id: "a9", name: "Quasar", role: "Sr Backend developer agent", email: "quasar@agents.agilecoder.app", kind: "agent", color: "#f67c7c" },
  { id: "a10", name: "Lumi", role: "Data agent", email: "lumi@agents.agilecoder.app", kind: "agent", color: "#7ce2f6" },
  { id: "a11", name: "UX Research Agent", role: "Research", email: "uxr@agents.agilecoder.app", kind: "agent", color: "#a58bf6" },
];

export const memberById = (id?: string) => members.find((m) => m.id === id);

export const projects: Project[] = [
  {
    id: "p1",
    slug: "paw-care",
    name: "Paw care",
    logo: { icon: "paw-print", from: "#f59e0b", to: "#ec4899" },
    description: "AI-powered pet care platform — vet appointments, vaccinations, health records and smart reminders.",
    favourite: true,
    status: "active",
    platform: "Mobile app (iOS/Android)",
    llm: "Google Gemini Pro",
    tokensAssigned: 100000,
    tokensUsed: 98280,
    memberIds: ["u1", "u2", "u3", "u4", "u5", "u6"],
  },
  {
    id: "p2",
    slug: "skin-care",
    name: "Skin care website",
    logo: { icon: "flower", from: "#ec4899", to: "#8b5cf6" },
    description: "D2C skincare storefront with routine builder and dermatologist chat.",
    favourite: true,
    status: "active",
    platform: "Web",
    llm: "Claude Opus 4",
    tokensAssigned: 60000,
    tokensUsed: 21400,
    memberIds: ["u1", "u3", "u4"],
  },
  {
    id: "p3",
    slug: "fit-coach",
    name: "Fit coach",
    logo: { icon: "dumbbell", from: "#10b981", to: "#0ea5e9" },
    description: "Fitness coaching mobile app with adaptive plans.",
    status: "inactive",
    platform: "Mobile app (iOS/Android)",
    llm: "GPT-5",
    tokensAssigned: 40000,
    tokensUsed: 39800,
    memberIds: ["u2", "u5"],
  },
];

export const sprints: Sprint[] = [
  { id: "s24", name: "Sprint 24", start: "2026-06-01", end: "2026-06-05", completed: 0.72, state: "active" },
  { id: "s23", name: "Sprint 23", start: "2026-05-25", end: "2026-05-29", completed: 1, state: "done" },
  { id: "s22", name: "Sprint 22", start: "2026-05-18", end: "2026-05-22", completed: 1, state: "done" },
  { id: "s20", name: "Sprint 20", start: "2026-05-04", end: "2026-05-08", completed: 0.8, state: "done" },
  { id: "s25", name: "Sprint 25", start: "2026-06-08", end: "2026-06-12", completed: 0, state: "planned" },
];

export const pipelines: Pipeline[] = [
  {
    id: "pm",
    name: "Project management",
    colorClass: "pipeline-pm",
    stages: [
      { id: "pm-todo", name: "To Do", pinned: "start" },
      { id: "pm-discovery", name: "Product discovery", agentId: "a1" },
      { id: "pm-planning", name: "Product planning", agentId: "a2" },
      { id: "pm-sprint", name: "Sprint planning" },
      { id: "pm-done", name: "Completed", pinned: "end" },
    ],
  },
  {
    id: "design",
    name: "Design",
    colorClass: "pipeline-design",
    stages: [
      { id: "d-todo", name: "To Do", pinned: "start" },
      { id: "d-research", name: "User research", agentId: "a3" },
      { id: "d-ia", name: "Information architecture", agentId: "a4" },
      { id: "d-lofi", name: "Low fidelity", agentId: "a5" },
      { id: "d-concept", name: "Concept design", agentId: "a6" },
      { id: "d-hifi", name: "High fidelity" },
      { id: "d-micro", name: "Micro interactions" },
      { id: "d-done", name: "Completed", pinned: "end" },
    ],
  },
  {
    id: "frontend",
    name: "Frontend",
    colorClass: "pipeline-frontend",
    stages: [
      { id: "f-todo", name: "To Do", pinned: "start" },
      { id: "f-scaffold", name: "Scaffolding" },
      { id: "f-components", name: "Component development", agentId: "a7" },
      { id: "f-api", name: "API integration" },
      { id: "f-qa", name: "Testing & quality assurance" },
      { id: "f-done", name: "Completed", pinned: "end" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    colorClass: "pipeline-backend",
    stages: [
      { id: "b-todo", name: "To Do", pinned: "start" },
      { id: "b-arch", name: "Planning and architecture", agentId: "a8" },
      { id: "b-db", name: "Database design", agentId: "a9" },
      { id: "b-logic", name: "Business logic & API development", agentId: "a10" },
      { id: "b-security", name: "Security audit" },
      { id: "b-done", name: "Completed", pinned: "end" },
    ],
  },
  {
    id: "testing",
    name: "Testing",
    colorClass: "pipeline-testing",
    stages: [
      { id: "t-todo", name: "To Do", pinned: "start" },
      { id: "t-plan", name: "Test planning" },
      { id: "t-scripts", name: "Test script development" },
      { id: "t-exec", name: "Execution & CI/CD integration" },
      { id: "t-done", name: "Completed", pinned: "end" },
    ],
  },
];

const d = (day: number) => `2026-06-${String(day).padStart(2, "0")}`;

export const workItems: WorkItem[] = [
  // ——— Epics
  { id: "e1", key: "PC-9012", title: "Application setup", type: "epic", priority: "high", status: "in-progress", assigneeId: "u2", points: 21, createdAt: d(1), description: "Foundation for the PawCare app — auth, scaffolding, environments and CI. Weekly sweep: aligned this task with the template by adding the standard onboarding subtasks, and set priority to Normal so the task meets the due date/priority rule." },
  { id: "e2", key: "PC-9013", title: "Artifacts", type: "epic", priority: "medium", status: "backlog", assigneeId: "u3", points: 13, createdAt: d(1) },
  { id: "e3", key: "PC-9014", title: "Onboarding", type: "epic", priority: "high", status: "in-progress", assigneeId: "u1", points: 18, createdAt: d(2) },
  { id: "e4", key: "PC-9015", title: "Home & dashboard", type: "epic", priority: "medium", status: "todo", assigneeId: "u4", points: 15, createdAt: d(2) },
  { id: "e5", key: "PC-9016", title: "Appointments", type: "epic", priority: "critical", status: "in-progress", assigneeId: "u5", points: 24, createdAt: d(3) },
  { id: "e6", key: "PC-9017", title: "My pets", type: "epic", priority: "medium", status: "backlog", assigneeId: "u3", points: 12, createdAt: d(3) },
  { id: "e7", key: "PC-9018", title: "Settings", type: "epic", priority: "low", status: "backlog", assigneeId: "u6", points: 8, createdAt: d(4) },
  { id: "e8", key: "PC-9019", title: "Profile", type: "epic", priority: "low", status: "backlog", assigneeId: "u4", points: 6, createdAt: d(4) },

  // ——— Application setup children
  { id: "w1", key: "PC-876", title: "Prepare project repository & CI", type: "feature", priority: "medium", status: "completed", assigneeId: "u5", parentId: "e1", sprintId: "s23", points: 5, pipelineId: "pm", stageId: "pm-done", createdAt: d(1), comments: 4 },
  { id: "w2", key: "PC-7580", title: "Environment set up and scaffolding", type: "story", priority: "high", status: "in-progress", assigneeId: "u4", parentId: "e1", sprintId: "s24", points: 3, pipelineId: "frontend", stageId: "f-scaffold", createdAt: d(2), comments: 2, dependencyIds: ["w1"] },
  { id: "w3", key: "PC-7364", title: "Auth — email, OTP and social sign-in", type: "story", priority: "critical", status: "in-progress", assigneeId: "u5", parentId: "e1", sprintId: "s24", points: 8, pipelineId: "backend", stageId: "b-logic", createdAt: d(2), comments: 7, attachments: 2 },
  { id: "w4", key: "PC-7643", title: "Design tokens & base components", type: "task", priority: "medium", status: "in-review", assigneeId: "u3", parentId: "e1", sprintId: "s24", points: 5, pipelineId: "design", stageId: "d-hifi", createdAt: d(3) },
  { id: "w5", key: "PC-1458", title: "Session management & logout everywhere", type: "task", priority: "high", status: "todo", assigneeId: "a9", parentId: "e1", sprintId: "s25", points: 3, pipelineId: "backend", stageId: "b-todo", createdAt: d(4), dependencyIds: ["w3"] },
  { id: "w6", key: "PC-9534", title: "Crash-free login on flaky networks", type: "bug", priority: "critical", status: "in-progress", assigneeId: "u4", parentId: "e1", sprintId: "s24", points: 2, pipelineId: "frontend", stageId: "f-qa", createdAt: d(5), comments: 3 },

  // ——— Onboarding children
  { id: "w7", key: "PC-5613", title: "Onboard with mobile number and OTP", type: "story", priority: "high", status: "completed", assigneeId: "u1", parentId: "e3", sprintId: "s23", points: 5, pipelineId: "design", stageId: "d-done", createdAt: d(1), description: "User should be able to onboard application using mobile number and OTP." },
  { id: "w8", key: "PC-9801", title: "App highlight scenes", type: "task", priority: "medium", status: "completed", assigneeId: "u3", parentId: "e3", sprintId: "s23", points: 3, pipelineId: "design", stageId: "d-done", createdAt: d(2), description: "Create personalized scenes to match every moment. Adjust lights, curtains, and ambience." },
  { id: "w9", key: "PC-7543", title: "Prepare Dashboard", type: "story", priority: "medium", status: "todo", assigneeId: "u2", parentId: "e4", sprintId: "s24", points: 5, pipelineId: "pm", stageId: "pm-todo", createdAt: d(3), description: "Prioritize and schedule the Home Dashboard feature, including health summary cards." },
  { id: "w10", key: "PC-1704", title: "Prepare pet registration module", type: "task", priority: "high", status: "todo", assigneeId: "u6", parentId: "e6", sprintId: "s24", points: 8, pipelineId: "pm", stageId: "pm-todo", createdAt: d(3), description: "Break down the pet registration experience into implementation-ready stories." },

  // ——— Appointments children
  { id: "w11", key: "PC-2755", title: "Vet search with pick slots & confirm", type: "feature", priority: "critical", status: "in-progress", assigneeId: "u5", parentId: "e5", sprintId: "s24", points: 8, pipelineId: "backend", stageId: "b-logic", createdAt: d(4), comments: 5 },
  { id: "w12", key: "PC-2756", title: "Appointment reminders via push", type: "story", priority: "medium", status: "todo", assigneeId: "a7", parentId: "e5", sprintId: "s25", points: 3, pipelineId: "frontend", stageId: "f-todo", createdAt: d(5) },
  { id: "w13", key: "PC-2757", title: "Calendar sync (Google/Apple)", type: "story", priority: "low", status: "backlog", assigneeId: "u4", parentId: "e5", points: 5, pipelineId: "frontend", stageId: "f-todo", createdAt: d(6) },
  { id: "w14", key: "PC-2760", title: "Slot double-booking race condition", type: "bug", priority: "high", status: "in-review", assigneeId: "u5", parentId: "e5", sprintId: "s24", points: 2, pipelineId: "backend", stageId: "b-security", createdAt: d(6), comments: 6 },

  // ——— Board extras across pipelines
  { id: "w15", key: "PC-3100", title: "User research — pet parents", type: "task", priority: "medium", status: "in-progress", assigneeId: "a3", parentId: "e2", sprintId: "s24", points: 3, pipelineId: "design", stageId: "d-research", createdAt: d(2) },
  { id: "w16", key: "PC-3101", title: "IA map for core journeys", type: "task", priority: "medium", status: "in-progress", assigneeId: "a4", parentId: "e2", sprintId: "s24", points: 3, pipelineId: "design", stageId: "d-ia", createdAt: d(3), dependencyIds: ["w15"] },
  { id: "w17", key: "PC-3102", title: "Low fidelity wireframes", type: "task", priority: "medium", status: "todo", assigneeId: "a5", parentId: "e2", sprintId: "s24", points: 5, pipelineId: "design", stageId: "d-lofi", createdAt: d(3) },
  { id: "w18", key: "PC-3103", title: "Concept design — visual direction", type: "task", priority: "low", status: "todo", assigneeId: "a6", parentId: "e2", points: 3, pipelineId: "design", stageId: "d-concept", createdAt: d(4) },
  { id: "w19", key: "PC-4200", title: "Component library — cards & lists", type: "task", priority: "medium", status: "in-progress", assigneeId: "a7", parentId: "e4", sprintId: "s24", points: 5, pipelineId: "frontend", stageId: "f-components", createdAt: d(4) },
  { id: "w20", key: "PC-4201", title: "Health records API integration", type: "story", priority: "high", status: "todo", assigneeId: "u4", parentId: "e4", sprintId: "s25", points: 5, pipelineId: "frontend", stageId: "f-api", createdAt: d(5), dependencyIds: ["w22"] },
  { id: "w21", key: "PC-5300", title: "Architecture plan & service boundaries", type: "task", priority: "high", status: "completed", assigneeId: "a8", parentId: "e1", sprintId: "s23", points: 5, pipelineId: "backend", stageId: "b-done", createdAt: d(1) },
  { id: "w22", key: "PC-5301", title: "Database schema — pets, visits, vaccines", type: "task", priority: "high", status: "in-progress", assigneeId: "a9", parentId: "e5", sprintId: "s24", points: 5, pipelineId: "backend", stageId: "b-db", createdAt: d(3) },
  { id: "w23", key: "PC-6100", title: "Test planning — critical flows", type: "task", priority: "medium", status: "todo", assigneeId: "u6", parentId: "e5", sprintId: "s24", points: 3, pipelineId: "testing", stageId: "t-plan", createdAt: d(4) },
  { id: "w24", key: "PC-6101", title: "E2E scripts — booking happy path", type: "task", priority: "medium", status: "todo", assigneeId: "u6", parentId: "e5", sprintId: "s25", points: 5, pipelineId: "testing", stageId: "t-scripts", createdAt: d(5) },
];

export const workItemById = (id: string) => workItems.find((w) => w.id === id);
export const workItemByKey = (key: string) => workItems.find((w) => w.key === key);
export const childrenOf = (id: string) => workItems.filter((w) => w.parentId === id);

export const epics = workItems.filter((w) => w.type === "epic");

export const activity: ActivityEvent[] = [
  { id: "ac1", actorId: "a5", action: "moved", target: "PC-3102 → Low fidelity", at: "2m ago" },
  { id: "ac2", actorId: "u5", action: "commented on", target: "PC-7364", at: "18m ago" },
  { id: "ac3", actorId: "a9", action: "completed", target: "PC-5301 schema draft", at: "1h ago" },
  { id: "ac4", actorId: "u3", action: "requested review on", target: "PC-7643", at: "2h ago" },
  { id: "ac5", actorId: "a1", action: "generated 4 stories for", target: "Appointments", at: "3h ago" },
  { id: "ac6", actorId: "u1", action: "approved", target: "Requirement document v03", at: "yesterday" },
];

export const notifications: Notification[] = [
  { id: "n1", title: "Echo finished Low fidelity", body: "12 wireframes ready for review in Design pipeline.", at: "2m ago", read: false, kind: "ai" },
  { id: "n2", title: "Venkat mentioned you", body: "“@ram can you confirm the sprint scope for PC-7364?”", at: "24m ago", read: false, kind: "mention" },
  { id: "n3", title: "Sprint 24 at risk", body: "Predicted completion 72% — 3 items likely to slip.", at: "1h ago", read: false, kind: "ai" },
  { id: "n4", title: "PC-2760 needs review", body: "Slot double-booking fix awaiting your approval.", at: "2h ago", read: true, kind: "update" },
  { id: "n5", title: "Token budget 98%", body: "Paw care has used 98,280 of 100,000 tokens.", at: "5h ago", read: true, kind: "system" },
];

// ——— Token analytics (Tokens dashboard)
export const tokenStats = {
  assigned: 48500,
  totalUsed: 12500,
  remaining: 36000,
  usagePct: 26,
  thisWeek: 9370,
  today: 1240,
  breakdown: [
    { label: "Requirement doc", value: 4400 },
    { label: "Design doc", value: 3300 },
    { label: "Epics & stories", value: 2500 },
    { label: "Regenerations", value: 980 },
    { label: "Development", value: 1320 },
    { label: "Testing", value: 210 },
  ],
  byUser: [
    { name: "Ram Pradeep", value: 12976 },
    { name: "Venkat", value: 8987 },
    { name: "Kowsik", value: 3290 },
    { name: "Deepthi", value: 1373 },
    { name: "Akalya", value: 2726 },
  ],
  trend: [
    { month: "Jan", value: 4200 },
    { month: "Feb", value: 6800 },
    { month: "Mar", value: 5400 },
    { month: "Apr", value: 9100 },
    { month: "May", value: 12597 },
    { month: "Jun", value: 14806 },
  ],
  byModule: [
    { module: "Requirements Document", llm: "GPT-5", tokens: 8200 },
    { module: "Design Document", llm: "Claude Opus 4", tokens: 12500 },
    { module: "Prompt Configuration", llm: "GPT-5", tokens: 3100 },
    { module: "AI Chat", llm: "Gemini 2.5 Pro", tokens: 14806 },
    { module: "Story Generation", llm: "GPT-5", tokens: 10400 },
    { module: "Task Generation", llm: "Claude Sonnet 4", tokens: 5300 },
    { module: "Design Generation", llm: "Claude Opus 4", tokens: 9800 },
  ],
};

export const sprintSummary = {
  totalEpics: 9,
  stories: 24,
  storiesInProgress: 12,
  counts: { completed: 12, bugs: 2, testing: 8, inReview: 14, inProgress: 44, backlog: 41 },
  performance: [
    { label: "Delivery performance", value: "4.2 days", delta: "+9%", positive: true },
    { label: "Sprint time", value: "2.8 days", delta: "-12%", positive: true },
    { label: "Quality score", value: "92%", delta: "+5%", positive: true },
    { label: "Predictability & Risk", value: "12%", delta: "-13%", positive: false },
  ],
  velocity: [
    { sprint: "S20", committed: 34, completed: 27 },
    { sprint: "S21", committed: 30, completed: 26 },
    { sprint: "S22", committed: 36, completed: 33 },
    { sprint: "S23", committed: 32, completed: 32 },
    { sprint: "S24", committed: 38, completed: 27 },
  ],
  burndown: [
    { day: "Mon", ideal: 38, actual: 38 },
    { day: "Tue", ideal: 28.5, actual: 33 },
    { day: "Wed", ideal: 19, actual: 24 },
    { day: "Thu", ideal: 9.5, actual: 14 },
    { day: "Fri", ideal: 0, actual: 11 },
  ],
  myWork: { total: 78, segments: [
    { label: "Completed", value: 27 },
    { label: "In progress", value: 22 },
    { label: "In review", value: 12 },
    { label: "Testing", value: 17 },
  ]},
};

export const currentUser = members[0];
