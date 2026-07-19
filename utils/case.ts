import { PRIORITY_ORDER } from "@/constants/task";
import type { CaseFile, ChecklistItem } from "@/types/case";

export function caseProgress(caseId: string, checklist: ChecklistItem[]): number {
  const items = checklist.filter((c) => c.caseId === caseId);
  if (items.length === 0) return 0;
  const done = items.filter((c) => c.completed).length;
  return Math.round((done / items.length) * 100);
}

export function sortCasesByCreatedAt(cases: CaseFile[]): CaseFile[] {
  return [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function sortCasesByCaseNumber(cases: CaseFile[]): CaseFile[] {
  return [...cases].sort((a, b) => a.caseNumber.localeCompare(b.caseNumber));
}

export function sortCasesByPriority(cases: CaseFile[]): CaseFile[] {
  return [...cases].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  );
}

/** progressById must be pre-computed (e.g. from checklist items) since progress isn't stored on CaseFile. */
export function sortCasesByProgress(cases: CaseFile[], progressById: Map<string, number>): CaseFile[] {
  return [...cases].sort(
    (a, b) => (progressById.get(b.id) ?? 0) - (progressById.get(a.id) ?? 0)
  );
}

export function buildChecklistTree(items: ChecklistItem[]) {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const children = new Map<string | null, ChecklistItem[]>();
  for (const item of sorted) {
    const key = item.parentId;
    if (!children.has(key)) children.set(key, []);
    children.get(key)!.push(item);
  }
  return { roots: children.get(null) ?? [], children };
}
