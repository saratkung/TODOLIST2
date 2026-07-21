"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SyncStatus } from "@/features/profile/components/sync-status";
import { ExportButton } from "@/features/profile/components/export-button";
import { ImportButton } from "@/features/profile/components/import-button";
import { useTaskStore } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useNoteStore } from "@/store/note-store";
import { useChecklistStore } from "@/store/checklist-store";
import { useTimelineStore } from "@/store/timeline-store";
import { useCaseNoteStore } from "@/store/case-note-store";
import { useAttachmentStore } from "@/store/attachment-store";
import { buildBackupPayload, estimateBackupSize, formatBytes } from "@/services/backup-service";

export function BackupCard() {
  const tasks = useTaskStore((s) => s.items);
  const cases = useCaseStore((s) => s.items);
  const events = useCalendarStore((s) => s.items);
  const notes = useNoteStore((s) => s.items);
  const checklist = useChecklistStore((s) => s.items);
  const timeline = useTimelineStore((s) => s.items);
  const caseNotes = useCaseNoteStore((s) => s.items);
  const attachments = useAttachmentStore((s) => s.items);

  const totalItems =
    tasks.length +
    cases.length +
    events.length +
    notes.length +
    checklist.length +
    timeline.length +
    caseNotes.length +
    attachments.length;
  const approxSize = estimateBackupSize(buildBackupPayload());

  return (
    <div className="space-y-4">
      <SyncStatus />

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{totalItems}</p>
            <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formatBytes(approxSize)}</p>
            <p className="text-xs text-muted-foreground">ขนาดข้อมูลโดยประมาณ</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <ExportButton />
        <ImportButton />
      </div>
    </div>
  );
}
