import type { BaseEntity, ReminderOffset } from "./common";

export type EventCategory =
  | "investigation"
  | "submission"
  | "appointment"
  | "custody"
  | "meeting";

/** Per-event Google Calendar sync state. Always undefined until a real Google connection exists. */
export type GoogleSyncStatus = "synced" | "syncing" | "error" | "not_synced";

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
  /** Set once this event has a counterpart in the user's Google Calendar. No code path sets this yet. */
  googleEventId?: string;
  syncStatus?: GoogleSyncStatus;
  lastSyncedAt?: string;
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
