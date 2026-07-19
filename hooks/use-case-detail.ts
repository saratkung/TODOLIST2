"use client";

import { useEffect, useMemo } from "react";
import { useCaseStore } from "@/store/case-store";
import { useChecklistStore } from "@/store/checklist-store";
import { useTimelineStore } from "@/store/timeline-store";
import { useCaseNoteStore } from "@/store/case-note-store";
import { useAttachmentStore } from "@/store/attachment-store";
import { useTaskStore } from "@/store/task-store";
import { useCalendarStore } from "@/store/calendar-store";

export function useCaseDetail(caseId: string) {
  const caseFile = useCaseStore((s) => s.items.find((c) => c.id === caseId));

  const checklistItems = useChecklistStore((s) => s.items);
  const checklist = useMemo(
    () => checklistItems.filter((c) => c.caseId === caseId),
    [checklistItems, caseId]
  );

  const timelineItems = useTimelineStore((s) => s.items);
  const timeline = useMemo(
    () => timelineItems.filter((t) => t.caseId === caseId),
    [timelineItems, caseId]
  );

  const caseNoteHydrated = useCaseNoteStore((s) => s.hydrated);
  const caseNoteHydrate = useCaseNoteStore((s) => s.hydrate);
  const caseNoteItems = useCaseNoteStore((s) => s.items);
  const caseNotes = useMemo(
    () => caseNoteItems.filter((n) => n.caseId === caseId),
    [caseNoteItems, caseId]
  );

  const attachmentHydrated = useAttachmentStore((s) => s.hydrated);
  const attachmentHydrate = useAttachmentStore((s) => s.hydrate);
  const attachmentItems = useAttachmentStore((s) => s.items);
  const attachments = useMemo(
    () => attachmentItems.filter((a) => a.caseId === caseId),
    [attachmentItems, caseId]
  );

  useEffect(() => {
    if (!caseNoteHydrated) caseNoteHydrate();
    if (!attachmentHydrated) attachmentHydrate();
  }, [caseNoteHydrated, caseNoteHydrate, attachmentHydrated, attachmentHydrate]);

  const taskItems = useTaskStore((s) => s.items);
  const relatedTasks = useMemo(
    () => taskItems.filter((t) => t.caseId === caseId),
    [taskItems, caseId]
  );

  const eventItems = useCalendarStore((s) => s.items);
  const relatedEvents = useMemo(
    () => eventItems.filter((e) => e.caseId === caseId),
    [eventItems, caseId]
  );

  return {
    caseFile,
    checklist,
    timeline,
    caseNotes,
    caseNoteHydrated,
    attachments,
    attachmentHydrated,
    relatedTasks,
    relatedEvents,
  };
}
