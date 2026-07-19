"use client";

import { FolderClosed, ListTodo, CheckCircle2, Lock, Search } from "lucide-react";
import { StatTile } from "@/features/analytics/components/stat-tile";
import { useTaskStore } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";
import { useChecklistStore } from "@/store/checklist-store";
import { useCalendarStore } from "@/store/calendar-store";
import { isToday } from "@/utils/date";
import { caseProgress } from "@/utils/case";

export function StatsGrid() {
  const tasks = useTaskStore((s) => s.items);
  const cases = useCaseStore((s) => s.items);
  const checklist = useChecklistStore((s) => s.items);
  const events = useCalendarStore((s) => s.items);

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const custodyToday = cases.filter((c) => c.custodyDeadline && isToday(c.custodyDeadline)).length;
  const investigationsToday = events.filter(
    (e) => e.category === "investigation" && isToday(e.start)
  ).length;
  const avgCompletion =
    cases.length === 0
      ? 0
      : Math.round(
          cases.reduce((sum, c) => sum + caseProgress(c.id, checklist), 0) / cases.length
        );

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile icon={FolderClosed} label="คดีทั้งหมด" value={cases.length} tone="primary" />
      <StatTile icon={ListTodo} label="งานค้าง" value={pendingTasks} tone="warning" />
      <StatTile icon={CheckCircle2} label="งานเสร็จแล้ว" value={completedTasks} tone="success" />
      <StatTile icon={Lock} label="ฝากขังวันนี้" value={custodyToday} tone="danger" />
      <StatTile icon={Search} label="สอบสวนวันนี้" value={investigationsToday} tone="primary" />
      <StatTile icon={CheckCircle2} label="ความคืบหน้าเฉลี่ย" value={`${avgCompletion}%`} tone="success" />
    </div>
  );
}
