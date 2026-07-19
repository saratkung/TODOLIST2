import type { CalendarEvent } from "@/types/calendar";
import { isToday } from "@/utils/date";

export function getTodayEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events
    .filter((e) => isToday(e.start))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function getUpcomingEvents(events: CalendarEvent[], count = 5): CalendarEvent[] {
  const now = Date.now();
  return events
    .filter((e) => new Date(e.start).getTime() >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, count);
}
