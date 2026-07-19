import { createEntityStore } from "@/store/create-entity-store";
import { caseService } from "@/services/case-service";
import type { ChecklistItem, ChecklistItemInput } from "@/types/case";

export const useChecklistStore = createEntityStore<ChecklistItem, ChecklistItemInput>(
  caseService.checklist
);

export async function toggleChecklistItem(id: string) {
  const item = useChecklistStore.getState().items.find((i) => i.id === id);
  if (!item) return;
  await useChecklistStore.getState().edit(id, { completed: !item.completed });
}

export async function reorderChecklist(caseId: string, orderedIds: string[]) {
  const reordered = await caseService.checklist.reorder(caseId, orderedIds);
  useChecklistStore.getState().setItems(reordered);
}
