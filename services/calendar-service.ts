import { createLocalRepository } from "@/lib/local-repository";
import type { CalendarEvent } from "@/types/calendar";

const repo = createLocalRepository<CalendarEvent>("investigator:calendar-events");

export const calendarService = {
  list: repo.list,
  seedIfEmpty: repo.seedIfEmpty,
  create: repo.create,
  update: repo.update,
  remove: repo.remove,
};
