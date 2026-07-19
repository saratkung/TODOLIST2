"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/features/tasks/components/task-form";
import { useTaskStore } from "@/store/task-store";
import type { Task, TaskInput } from "@/types/task";

interface EditTaskSheetProps {
  task: Task | null;
  onClose: () => void;
}

export function EditTaskSheet({ task, onClose }: EditTaskSheetProps) {
  const editTask = useTaskStore((s) => s.edit);
  const removeTask = useTaskStore((s) => s.remove);

  if (!task) return null;

  async function handleSubmit(input: TaskInput) {
    if (!task) return;
    await editTask(task.id, input);
    toast.success("บันทึกการเปลี่ยนแปลงแล้ว");
    onClose();
  }

  async function handleDelete() {
    if (!task) return;
    await removeTask(task.id);
    toast.success("ลบงานแล้ว");
    onClose();
  }

  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[24px]">
        <SheetHeader>
          <SheetTitle>แก้ไขงาน</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <TaskForm
            submitLabel="บันทึกการเปลี่ยนแปลง"
            defaultValues={{
              title: task.title,
              description: task.description,
              priority: task.priority,
              dueDate: task.dueDate?.slice(0, 16),
              reminder: task.reminder,
              recurrence: task.recurrence,
              caseId: task.caseId,
              calendarEventId: task.calendarEventId,
            }}
            defaultTags={task.tags}
            onSubmit={handleSubmit}
          />
          <Button variant="destructive" className="w-full" onClick={handleDelete}>
            <Trash2 className="size-4" /> ลบงานนี้
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
