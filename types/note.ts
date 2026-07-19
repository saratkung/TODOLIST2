import type { BaseEntity } from "./common";

export interface Note extends BaseEntity {
  title: string;
  content: string;
  pinned: boolean;
  favorite: boolean;
  caseId?: string;
}

export type NoteInput = Pick<Note, "title" | "content" | "caseId">;
