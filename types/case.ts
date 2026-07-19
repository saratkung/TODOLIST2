import type { BaseEntity, Priority } from "./common";

export type CaseStatus =
  | "received"
  | "investigating"
  | "pending_result"
  | "submitted"
  | "closed";

export interface CaseFile extends BaseEntity {
  caseNumber: string;
  title: string;
  category: string;
  description?: string;
  complainant?: string;
  victim?: string;
  suspect?: string;
  officer: string;
  status: CaseStatus;
  priority: Priority;
  deadline?: string;
  custodyDeadline?: string;
  submissionDeadline?: string;
}

export type CaseInput = Pick<
  CaseFile,
  | "caseNumber"
  | "title"
  | "category"
  | "description"
  | "complainant"
  | "victim"
  | "suspect"
  | "officer"
  | "status"
  | "priority"
  | "deadline"
  | "custodyDeadline"
  | "submissionDeadline"
>;

export interface ChecklistItem extends BaseEntity {
  caseId: string;
  parentId: string | null;
  title: string;
  completed: boolean;
  order: number;
}

export type ChecklistItemInput = Pick<ChecklistItem, "caseId" | "parentId" | "title">;

export interface TimelineEvent extends BaseEntity {
  caseId: string;
  title: string;
  description?: string;
  timestamp: string;
  order: number;
}

export type TimelineEventInput = Pick<
  TimelineEvent,
  "caseId" | "title" | "description" | "timestamp"
>;

export interface CaseNote extends BaseEntity {
  caseId: string;
  content: string;
  pinned?: boolean;
}

export type CaseNoteInput = Pick<CaseNote, "caseId" | "content">;

export interface Attachment extends BaseEntity {
  caseId: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  kind: "pdf" | "word" | "excel" | "image" | "audio" | "video" | "link" | "other";
}

export type AttachmentInput = Pick<
  Attachment,
  "caseId" | "name" | "mimeType" | "size" | "url" | "kind"
>;
