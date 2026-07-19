"use client";

import Link from "next/link";
import { ListChecks, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { SwipeableTaskRow } from "@/features/tasks/components/swipeable-task-row";
import { useTaskStore } from "@/store/task-store";
import { useUiStore } from "@/store/ui-store";
import { getTodayTasks, sortByPriority } from "@/utils/task";

export function TodayTasksCard() {
  const tasks = useTaskStore((s) => s.items);
  const todayTasks = sortByPriority(getTodayTasks(tasks));
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);

  return (
    <Card>
      <CardHeader>
        <CardTitle>งานวันนี้</CardTitle>
        <CardAction className="flex items-center gap-3">
          <Link href="/tasks" className="text-xs font-medium text-primary">
            ดูทั้งหมด
          </Link>
          <button
            onClick={() => {
              const now = new Date();
              const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
                now.getDate()
              ).padStart(2, "0")}`;
              openCreateDialog("task", { dueDate: `${localDate}T18:00` });
            }}
            aria-label="เพิ่มงานวันนี้"
            className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25 active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2} />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {todayTasks.length === 0 ? (
          <EmptyState icon={ListChecks} title="ไม่มีงานสำหรับวันนี้" />
        ) : (
          <div className="space-y-1.5">
            {todayTasks.map((task) => (
              <SwipeableTaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
