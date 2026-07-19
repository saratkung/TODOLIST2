"use client";

import { use } from "react";
import {
  Gauge,
  ListChecks,
  GitCommitVertical,
  ListTodo,
  CalendarClock,
  NotebookPen,
  Paperclip,
  Plus,
  FolderX,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { CaseHeader } from "@/features/cases/components/case-header";
import { WorkspaceSection } from "@/features/cases/components/workspace-section";
import { WorkspaceSectionSkeleton } from "@/features/cases/components/workspace-section-skeleton";
import { ProgressCard } from "@/features/cases/components/progress-card";
import { CaseChecklist } from "@/features/cases/components/case-checklist";
import { CaseTimeline } from "@/features/cases/components/case-timeline";
import { CaseRelatedTasks } from "@/features/cases/components/case-related-tasks";
import { CaseRelatedAppointments } from "@/features/cases/components/case-related-appointments";
import { CaseNotesPanel } from "@/features/cases/components/case-notes-panel";
import { CaseAttachmentsPanel } from "@/features/cases/components/case-attachments-panel";
import { useCaseDetail } from "@/hooks/use-case-detail";
import { useCaseStore } from "@/store/case-store";
import { useUiStore } from "@/store/ui-store";
import { caseProgress } from "@/utils/case";

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    caseFile,
    checklist,
    timeline,
    caseNotes,
    caseNoteHydrated,
    attachments,
    attachmentHydrated,
    relatedTasks,
    relatedEvents,
  } = useCaseDetail(id);
  const hydrated = useCaseStore((s) => s.hydrated);
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);

  if (!caseFile) {
    return (
      <div className="pt-12">
        <EmptyState
          icon={FolderX}
          title={hydrated ? "ไม่พบคดีนี้" : "กำลังโหลด..."}
          description={hydrated ? "คดีอาจถูกลบไปแล้ว" : undefined}
        />
      </div>
    );
  }

  const progress = caseProgress(id, checklist);

  return (
    <div className="space-y-4">
      <CaseHeader caseFile={caseFile} progress={progress} />

      <WorkspaceSection title="ความคืบหน้า" icon={Gauge}>
        <ProgressCard progress={progress} tasks={relatedTasks} />
      </WorkspaceSection>

      <WorkspaceSection title="Checklist" icon={ListChecks} count={checklist.length}>
        <CaseChecklist caseId={id} checklist={checklist} />
      </WorkspaceSection>

      <WorkspaceSection title="Timeline" icon={GitCommitVertical} count={timeline.length}>
        <CaseTimeline caseId={id} timeline={timeline} />
      </WorkspaceSection>

      <WorkspaceSection
        title="Tasks"
        icon={ListTodo}
        count={relatedTasks.length}
        action={
          <button
            onClick={() => openCreateDialog("task", { caseId: id })}
            aria-label="เพิ่มงาน"
            className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25 active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2} />
          </button>
        }
      >
        <CaseRelatedTasks caseId={id} tasks={relatedTasks} />
      </WorkspaceSection>

      <WorkspaceSection
        title="นัดหมาย"
        icon={CalendarClock}
        count={relatedEvents.length}
        action={
          <button
            onClick={() => openCreateDialog("event", { caseId: id })}
            aria-label="เพิ่มนัดหมาย"
            className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25 active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2} />
          </button>
        }
      >
        <CaseRelatedAppointments caseId={id} events={relatedEvents} />
      </WorkspaceSection>

      <WorkspaceSection title="Note" icon={NotebookPen} count={caseNotes.length}>
        {caseNoteHydrated ? (
          <CaseNotesPanel caseId={id} notes={caseNotes} />
        ) : (
          <WorkspaceSectionSkeleton />
        )}
      </WorkspaceSection>

      <WorkspaceSection
        title="เอกสาร"
        icon={Paperclip}
        count={attachments.length}
        defaultOpen={false}
      >
        {attachmentHydrated ? (
          <CaseAttachmentsPanel caseId={id} attachments={attachments} />
        ) : (
          <WorkspaceSectionSkeleton />
        )}
      </WorkspaceSection>
    </div>
  );
}
