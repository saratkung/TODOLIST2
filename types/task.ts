import type { BaseEntity, Priority, ReminderOffset } from "./common";

export type RecurrenceRule = "none" | "daily" | "weekly" | "monthly";

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  tags: string[];
  dueDate?: string;
  reminder?: ReminderOffset;
  recurrence: RecurrenceRule;
  caseId?: string;
  calendarEventId?: string;
  order: number;
}

export type TaskInput = Pick<
  Task,
  | "title"
  | "description"
  | "priority"
  | "tags"
  | "dueDate"
  | "reminder"
  | "recurrence"
  | "caseId"
  | "calendarEventId"
>;
