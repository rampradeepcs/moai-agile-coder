export type WorkItemType = "epic" | "feature" | "story" | "task" | "subtask" | "bug";

export type Priority = "low" | "medium" | "high" | "critical";

export type Status =
  | "backlog"
  | "todo"
  | "in-progress"
  | "in-review"
  | "testing"
  | "completed"
  | "blocked";

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  /** AI agents can be assigned work alongside humans */
  kind: "human" | "agent";
  color: string;
}

export interface WorkItem {
  id: string;
  key: string; // e.g. PC-876
  title: string;
  description?: string;
  type: WorkItemType;
  priority: Priority;
  status: Status;
  assigneeId?: string;
  sprintId?: string;
  release?: string;
  points?: number;
  parentId?: string;
  pipelineId?: string;
  stageId?: string;
  dependencyIds?: string[];
  labels?: string[];
  createdAt: string;
  comments?: number;
  attachments?: number;
}

export interface Stage {
  id: string;
  name: string;
  /** pinned stages can't be removed and drive auto-move behaviour */
  pinned?: "start" | "end";
  agentId?: string; // AI agent that owns this stage, otherwise manual
  color?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  colorClass: string; // pipeline-* utility
  stages: Stage[];
}

export interface Sprint {
  id: string;
  name: string;
  start: string;
  end: string;
  completed: number; // 0..1
  state: "active" | "planned" | "done";
}

export interface ProjectLogoSpec {
  /** key into the logo icon map (see components/work/project-logo.tsx) */
  icon: string;
  /** gradient stops for the mark's background */
  from: string;
  to: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo?: ProjectLogoSpec;
  /** unseen work recently completed by AI agents on this project */
  aiActivity?: { count: number; message: string };
  favourite?: boolean;
  status: "active" | "inactive" | "deprecated";
  platform: string;
  llm: string;
  tokensAssigned: number;
  tokensUsed: number;
  memberIds: string[];
}

export interface ActivityEvent {
  id: string;
  actorId: string;
  action: string;
  target: string;
  at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  kind: "mention" | "update" | "ai" | "system";
}
