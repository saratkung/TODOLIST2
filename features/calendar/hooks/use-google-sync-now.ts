"use client";

import { toast } from "sonner";
import { useCalendarStore } from "@/store/calendar-store";
import { useGoogleCalendarStore } from "@/store/google-calendar-store";
import { googleCalendarSyncService, CalendarSyncError } from "@/services/google-calendar-sync-service";

/**
 * Pulls events from Google Calendar and imports any that don't already
 * have a local counterpart (matched by googleEventId). Shared by the
 * Profile > Google Calendar "Sync Now" button and the Calendar page's
 * header sync button so both stay in sync with the same logic.
 */
export function useGoogleSyncNow() {
  const calendarEvents = useCalendarStore((s) => s.items);
  const addCalendarEvent = useCalendarStore((s) => s.add);
  const editCalendarEvent = useCalendarStore((s) => s.edit);
  const setSyncing = useGoogleCalendarStore((s) => s.setSyncing);
  const setSynced = useGoogleCalendarStore((s) => s.setSynced);
  const setSyncError = useGoogleCalendarStore((s) => s.setSyncError);

  async function syncNow() {
    setSyncing();
    try {
      const { events } = await googleCalendarSyncService.readEvents();
      const existingGoogleIds = new Set(calendarEvents.map((e) => e.googleEventId).filter(Boolean));
      let importedCount = 0;

      for (const gEvent of events) {
        if (existingGoogleIds.has(gEvent.id)) continue;
        const startIso = gEvent.start.dateTime ?? gEvent.start.date;
        if (!startIso) continue;

        const created = await addCalendarEvent({
          title: gEvent.summary || "(ไม่มีชื่อ)",
          start: startIso,
          end: gEvent.end.dateTime ?? gEvent.end.date,
          allDay: !gEvent.start.dateTime,
          category: "appointment",
          notes: gEvent.description,
          location: gEvent.location,
        });
        await editCalendarEvent(created.id, {
          googleEventId: gEvent.id,
          syncStatus: "synced",
          lastSyncedAt: new Date().toISOString(),
        });
        importedCount++;
      }

      setSynced();
      toast.success(importedCount > 0 ? `นำเข้า ${importedCount} รายการจาก Google Calendar` : "ซิงก์แล้ว ไม่มีรายการใหม่");
    } catch (error) {
      const message = error instanceof CalendarSyncError ? error.message : "ซิงก์ไม่สำเร็จ";
      setSyncError(message);
      toast.error(message);
    }
  }

  return { syncNow };
}
