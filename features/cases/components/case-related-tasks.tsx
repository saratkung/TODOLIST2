"use client";

import { useState } from "react";
import { ListTodo } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { SwipeableTaskRow } from "@/features/tasks/components/swipeable-task-row";
import { EditTaskSheet } from "@/features/tasks/components/edit-task-sheet";
import { useUiStore } from "@/store/ui-store";
import { sortByDueDate } from "@/utils/task";
import type { Task } from "@/types/task";

interface CaseRelatedTasksProps {
  caseId: string;
  tasks: Task[];
}

export function CaseRelatedTasks({ caseId, tasks }: CaseRelatedTasksProps) {
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);
  const [editing, setEditing] = useState<Task | null>(null);
  const sorted = sortByDueDate(tasks);

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="ยังไม่มีงานที่เกี่ยวข้อง"
          action={
            <Button size="sm" onClick={() => openCreateDialog("task", { caseId })}>
              เพิ่มงาน
            </Button>
          }
        />
      ) : (
        <div className="space-y-1.5">
          {sorted.map((task) => (
            <SwipeableTaskRow key={task.id} task={task} onEdit={() => setEditing(task)} />
          ))}
        </div>
      )}

      <EditTaskSheet task={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
