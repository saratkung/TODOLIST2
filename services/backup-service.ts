import { taskService } from "@/services/task-service";
import { caseService } from "@/services/case-service";
import { calendarService } from "@/services/calendar-service";
import { noteService } from "@/services/note-service";
import { useTaskStore } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useNoteStore } from "@/store/note-store";
import { useChecklistStore } from "@/store/checklist-store";
import { useTimelineStore } from "@/store/timeline-store";
import { useCaseNoteStore } from "@/store/case-note-store";
import { useAttachmentStore } from "@/store/attachment-store";
import { useProfileStore } from "@/store/profile-store";
import type { Task } from "@/types/task";
import type { CaseFile, ChecklistItem, TimelineEvent, CaseNote, Attachment } from "@/types/case";
import type { CalendarEvent } from "@/types/calendar";
import type { Note } from "@/types/note";

const BACKUP_VERSION = 1;
const BACKUP_APP_ID = "investigator";

const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "name",
  "rank",
  "position",
  "department",
  "email",
  "phone",
  "avatarUrl",
  "memberSince",
  "notificationsEnabled",
] as const;

type BackupProfile = Pick<ReturnType<typeof useProfileStore.getState>, (typeof PROFILE_FIELDS)[number]>;

export interface BackupPayload {
  version: number;
  app: typeof BACKUP_APP_ID;
  exportedAt: string;
  data: {
    tasks: Task[];
    cases: CaseFile[];
    calendarEvents: CalendarEvent[];
    notes: Note[];
    checklistItems: ChecklistItem[];
    timelineEvents: TimelineEvent[];
    caseNotes: CaseNote[];
    attachments: Attachment[];
    profile: BackupProfile;
  };
}

const DATA_ARRAY_KEYS = [
  "tasks",
  "cases",
  "calendarEvents",
  "notes",
  "checklistItems",
  "timelineEvents",
  "caseNotes",
  "attachments",
] as const;

export function buildBackupPayload(): BackupPayload {
  const profile = useProfileStore.getState();
  const profileBackup = Object.fromEntries(
    PROFILE_FIELDS.map((key) => [key, profile[key]])
  ) as BackupProfile;

  return {
    version: BACKUP_VERSION,
    app: BACKUP_APP_ID,
    exportedAt: new Date().toISOString(),
    data: {
      tasks: useTaskStore.getState().items,
      cases: useCaseStore.getState().items,
      calendarEvents: useCalendarStore.getState().items,
      notes: useNoteStore.getState().items,
      checklistItems: useChecklistStore.getState().items,
      timelineEvents: useTimelineStore.getState().items,
      caseNotes: useCaseNoteStore.getState().items,
      attachments: useAttachmentStore.getState().items,
      profile: profileBackup,
    },
  };
}

export function countBackupItems(payload: BackupPayload): number {
  return DATA_ARRAY_KEYS.reduce((total, key) => total + payload.data[key].length, 0);
}

export function estimateBackupSize(payload: BackupPayload): number {
  if (typeof Blob === "undefined") return JSON.stringify(payload).length;
  return new Blob([JSON.stringify(payload)]).size;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function downloadBackup(payload: BackupPayload) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `investigator-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Structural check only — does not deeply validate every field, just enough to reject garbage/foreign files safely. */
export function validateBackupPayload(raw: unknown): raw is BackupPayload {
  if (typeof raw !== "object" || raw === null) return false;
  const obj = raw as Record<string, unknown>;

  if (obj.app !== BACKUP_APP_ID) return false;
  if (typeof obj.version !== "number") return false;
  if (typeof obj.data !== "object" || obj.data === null) return false;

  const data = obj.data as Record<string, unknown>;
  for (const key of DATA_ARRAY_KEYS) {
    if (!Array.isArray(data[key])) return false;
  }
  if (typeof data.profile !== "object" || data.profile === null) return false;

  return true;
}

/** Overwrites all local data with the backup's contents. Callers should confirm with the user first — this is destructive. */
export async function restoreBackup(payload: BackupPayload): Promise<void> {
  const { data } = payload;

  await taskService.replaceAll(data.tasks);
  useTaskStore.getState().setItems(data.tasks);

  await caseService.replaceAll(data.cases);
  useCaseStore.getState().setItems(data.cases);

  await calendarService.replaceAll(data.calendarEvents);
  useCalendarStore.getState().setItems(data.calendarEvents);

  await noteService.replaceAll(data.notes);
  useNoteStore.getState().setItems(data.notes);

  await caseService.checklist.replaceAll(data.checklistItems);
  useChecklistStore.getState().setItems(data.checklistItems);

  await caseService.timeline.replaceAll(data.timelineEvents);
  useTimelineStore.getState().setItems(data.timelineEvents);

  await caseService.notes.replaceAll(data.caseNotes);
  useCaseNoteStore.getState().setItems(data.caseNotes);

  await caseService.attachments.replaceAll(data.attachments);
  useAttachmentStore.getState().setItems(data.attachments);

  useProfileStore.getState().setProfile(data.profile);
  useProfileStore.getState().setAvatar(data.profile.avatarUrl);
  useProfileStore.getState().setNotificationsEnabled(data.profile.notificationsEnabled);
  useProfileStore.setState({ memberSince: data.profile.memberSince });
}
