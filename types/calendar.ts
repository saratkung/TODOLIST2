import type { BaseEntity, ReminderOffset } from "./common";

export type EventCategory =
  | "investigation"
  | "submission"
  | "appointment"
  | "custody"
  | "meeting";

export interface CalendarEvent extends BaseEntity {
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  category: EventCategory;
  caseId?: string;
  notes?: string;
  location?: string;
  reminder?: ReminderOffset;
}

export type CalendarEventInput = Pick<
  CalendarEvent,
  | "title"
  | "start"
  | "end"
  | "allDay"
  | "category"
  | "caseId"
  | "notes"
  | "location"
  | "reminder"
>;
