import { createLocalRepository } from "@/lib/local-repository";
import type {
  CaseFile,
  CaseInput,
  CaseStatus,
  ChecklistItem,
  ChecklistItemInput,
  TimelineEvent,
  TimelineEventInput,
  CaseNote,
  CaseNoteInput,
  Attachment,
  AttachmentInput,
} from "@/types/case";

const caseRepo = createLocalRepository<CaseFile>("investigator:cases");
const checklistRepo = createLocalRepository<ChecklistItem>("investigator:checklist-items");
const timelineRepo = createLocalRepository<TimelineEvent>("investigator:timeline-events");
const caseNoteRepo = createLocalRepository<CaseNote>("investigator:case-notes");
const attachmentRepo = createLocalRepository<Attachment>("investigator:attachments");

const VALID_STATUSES = new Set<CaseStatus>([
  "received",
  "investigating",
  "pending_result",
  "submitted",
  "closed",
]);

// Cases persisted before the status enum was expanded (Phase 4) may still carry
// the old "pending_submission" value in localStorage — remap it on read so
// existing local data doesn't crash lookups like CASE_STATUS_META[status].
const LEGACY_STATUS_MAP: Record<string, CaseStatus> = {
  pending_submission: "pending_result",
};

function normalizeCase(raw: CaseFile): CaseFile {
  const status = VALID_STATUSES.has(raw.status)
    ? raw.status
    : (LEGACY_STATUS_MAP[raw.status as string] ?? "received");
  return {
    ...raw,
    status,
    category: raw.category ?? "คดีอื่นๆ",
  };
}

export const caseService = {
  async list(): Promise<CaseFile[]> {
    const items = await caseRepo.list();
    return items.map(normalizeCase);
  },
  async seedIfEmpty(seed: CaseFile[]): Promise<CaseFile[]> {
    const items = await caseRepo.seedIfEmpty(seed);
    return items.map(normalizeCase);
  },
  update: caseRepo.update,
  remove: caseRepo.remove,
  replaceAll: caseRepo.replaceAll,

  async create(input: CaseInput): Promise<CaseFile> {
    return caseRepo.create(input);
  },

  checklist: {
    list: checklistRepo.list,
    seedIfEmpty: checklistRepo.seedIfEmpty,
    update: checklistRepo.update,
    remove: checklistRepo.remove,
    replaceAll: checklistRepo.replaceAll,

    async create(input: ChecklistItemInput): Promise<ChecklistItem> {
      const items = await checklistRepo.list();
      const siblingCount = items.filter(
        (i) => i.caseId === input.caseId && i.parentId === input.parentId
      ).length;
      return checklistRepo.create({ ...input, completed: false, order: siblingCount });
    },

    async reorder(caseId: string, orderedIds: string[]): Promise<ChecklistItem[]> {
      const items = await checklistRepo.list();
      const byId = new Map(items.map((i) => [i.id, i]));
      const reordered = orderedIds
        .map((id, index) => {
          const item = byId.get(id);
          if (!item) return null;
          return { ...item, order: index };
        })
        .filter((i): i is ChecklistItem => i !== null);
      const untouched = items.filter(
        (i) => i.caseId !== caseId || !orderedIds.includes(i.id)
      );
      return checklistRepo.replaceAll([...reordered, ...untouched]);
    },
  },

  timeline: {
    list: timelineRepo.list,
    seedIfEmpty: timelineRepo.seedIfEmpty,
    update: timelineRepo.update,
    remove: timelineRepo.remove,
    replaceAll: timelineRepo.replaceAll,

    async create(input: TimelineEventInput): Promise<TimelineEvent> {
      const items = await timelineRepo.list();
      const order = items.filter((i) => i.caseId === input.caseId).length;
      return timelineRepo.create({ ...input, order });
    },
  },

  notes: {
    list: caseNoteRepo.list,
    update: caseNoteRepo.update,
    remove: caseNoteRepo.remove,
    replaceAll: caseNoteRepo.replaceAll,
    create: (input: CaseNoteInput) => caseNoteRepo.create(input),
  },

  attachments: {
    list: attachmentRepo.list,
    update: attachmentRepo.update,
    remove: attachmentRepo.remove,
    replaceAll: attachmentRepo.replaceAll,
    create: (input: AttachmentInput) => attachmentRepo.create(input),
  },
};
