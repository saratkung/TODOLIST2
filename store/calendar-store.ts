import { createEntityStore } from "@/store/create-entity-store";
import { calendarService } from "@/services/calendar-service";
import type { CalendarEvent, CalendarEventInput } from "@/types/calendar";

export const useCalendarStore = createEntityStore<CalendarEvent, CalendarEventInput>(
  calendarService
);
