import type { CalendarEvent } from "@/types/calendar";

/**
 * Shape of a Google Calendar API event resource, trimmed to the fields
 * this app maps to/from.
 * https://developers.google.com/calendar/api/v3/reference/events
 */
export interface GoogleCalendarEventDTO {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  updated: string;
}

export type CalendarSyncErrorReason = "not_connected" | "token_expired" | "offline" | "api_error";

export class CalendarSyncError extends Error {
  constructor(
    message: string,
    public readonly reason: CalendarSyncErrorReason
  ) {
    super(message);
    this.name = "CalendarSyncError";
  }
}

/**
 * Two-way sync contract between local calendar_events and a user's
 * Google Calendar. This is the Repository/Service boundary the rest of
 * the app depends on — swap the implementation, not the callers.
 */
export interface CalendarSyncService {
  createEvent(event: CalendarEvent): Promise<{ googleEventId: string }>;
  updateEvent(googleEventId: string, event: CalendarEvent): Promise<void>;
  deleteEvent(googleEventId: string): Promise<void>;
  readEvents(syncToken?: string): Promise<{ events: GoogleCalendarEventDTO[]; nextSyncToken: string }>;
}

function toGoogleEventResource(event: CalendarEvent) {
  const dateOnly = event.start.slice(0, 10);
  const endDateOnly = (event.end ?? event.start).slice(0, 10);

  return {
    summary: event.title,
    description: event.notes || undefined,
    location: event.location || undefined,
    start: event.allDay ? { date: dateOnly } : { dateTime: event.start },
    end: event.allDay ? { date: endDateOnly } : { dateTime: event.end ?? event.start },
  };
}

/**
 * Calls this app's own /api/google-calendar/* route handlers, which hold
 * the Google access token server-side (httpOnly encrypted cookie — see
 * lib/google-session.ts) and forward to the real Calendar API v3. The
 * client never sees the token.
 */
class HttpCalendarSyncService implements CalendarSyncService {
  async createEvent(event: CalendarEvent): Promise<{ googleEventId: string }> {
    const res = await fetch("/api/google-calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toGoogleEventResource(event)),
    });
    return this.parseOrThrow<{ googleEventId: string }>(res);
  }

  async updateEvent(googleEventId: string, event: CalendarEvent): Promise<void> {
    const res = await fetch(`/api/google-calendar/events/${encodeURIComponent(googleEventId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toGoogleEventResource(event)),
    });
    await this.parseOrThrow(res);
  }

  async deleteEvent(googleEventId: string): Promise<void> {
    const res = await fetch(`/api/google-calendar/events/${encodeURIComponent(googleEventId)}`, {
      method: "DELETE",
    });
    await this.parseOrThrow(res);
  }

  async readEvents(syncToken?: string): Promise<{ events: GoogleCalendarEventDTO[]; nextSyncToken: string }> {
    const url = syncToken
      ? `/api/google-calendar/events?syncToken=${encodeURIComponent(syncToken)}`
      : "/api/google-calendar/events";
    const res = await fetch(url);
    const data = await this.parseOrThrow<{ events: GoogleCalendarEventDTO[]; nextSyncToken: string | null }>(res);
    return { events: data.events, nextSyncToken: data.nextSyncToken ?? "" };
  }

  private async parseOrThrow<T>(res: Response): Promise<T> {
    if (res.status === 401) {
      throw new CalendarSyncError("ยังไม่ได้เชื่อมต่อ Google Calendar", "not_connected");
    }
    if (!res.ok) {
      throw new CalendarSyncError("เกิดข้อผิดพลาดขณะติดต่อ Google Calendar", "api_error");
    }
    return res.json() as Promise<T>;
  }
}

export const googleCalendarSyncService: CalendarSyncService = new HttpCalendarSyncService();
