"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, ListChecks } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ChecklistItemRow } from "@/features/cases/components/checklist-item-row";
import { useChecklistStore, reorderChecklist } from "@/store/checklist-store";
import { buildChecklistTree } from "@/utils/case";
import type { ChecklistItem } from "@/types/case";

export function CaseChecklist({ caseId, checklist }: { caseId: string; checklist: ChecklistItem[] }) {
  const addItem = useChecklistStore((s) => s.add);
  const [newTitle, setNewTitle] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const { roots, children } = buildChecklistTree(checklist);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = roots.findIndex((r) => r.id === active.id);
    const newIndex = roots.findIndex((r) => r.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(roots, oldIndex, newIndex);
    reorderChecklist(caseId, reordered.map((r) => r.id));
  }

  function submitNewItem() {
    if (!newTitle.trim()) return;
    addItem({ caseId, parentId: null, title: newTitle.trim() });
    setNewTitle("");
  }

  return (
    <div className="space-y-4">
      {roots.length === 0 ? (
        <EmptyState icon={ListChecks} title="ยังไม่มีรายการตรวจสอบ" />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={roots.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-0.5">
              {roots.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  childItems={children.get(item.id) ?? []}
                  caseId={caseId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex items-center gap-2 rounded-2xl bg-white/[0.03] px-3 py-2">
        <Plus className="size-4 text-muted-foreground" />
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitNewItem()}
          placeholder="เพิ่มรายการตรวจสอบ..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
