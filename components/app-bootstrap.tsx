"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";
import { useChecklistStore } from "@/store/checklist-store";
import { useTimelineStore } from "@/store/timeline-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useNoteStore } from "@/store/note-store";
import {
  seedTasks,
  seedCases,
  seedChecklistItems,
  seedTimelineEvents,
  seedCalendarEvents,
  seedNotes,
} from "@/lib/seed-data";

export function AppBootstrap() {
  useEffect(() => {
    useTaskStore.getState().hydrate(seedTasks());
    useCaseStore.getState().hydrate(seedCases());
    useChecklistStore.getState().hydrate(seedChecklistItems());
    useTimelineStore.getState().hydrate(seedTimelineEvents());
    useCalendarStore.getState().hydrate(seedCalendarEvents());
    useNoteStore.getState().hydrate(seedNotes());
  }, []);

  return null;
}
