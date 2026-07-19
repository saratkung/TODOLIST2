"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/ui-store";
import { useTaskStore } from "@/store/task-store";
import { TaskForm, type TaskFormValues } from "@/features/tasks/components/task-form";
import type { TaskInput } from "@/types/task";

export function CreateTaskDialog() {
  const isOpen = useUiStore((s) => s.createDialog === "task");
  const closeCreateDialog = useUiStore((s) => s.closeCreateDialog);
  const defaults = useUiStore((s) => s.createDialogDefaults);
  const addTask = useTaskStore((s) => s.add);

  async function handleSubmit(input: TaskInput) {
    await addTask(input);
    toast.success("สร้างงานเรียบร้อยแล้ว");
    closeCreateDialog();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>สร้างงานใหม่</DialogTitle>
        </DialogHeader>
        {isOpen && (
          <TaskForm onSubmit={handleSubmit} defaultValues={defaults as Partial<TaskFormValues>} />
        )}
      </DialogContent>
    </Dialog>
  );
}
