"use client";

import { motion } from "framer-motion";
import { Check, FolderClosed } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "@/features/tasks/components/priority-badge";
import { TagBadge } from "@/features/tasks/components/tag-badge";
import { toggleTaskComplete } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";
import { formatThaiTime } from "@/utils/date";
import type { Task } from "@/types/task";

interface TaskRowProps {
  task: Task;
  onClick?: () => void;
}

export function TaskRow({ task, onClick }: TaskRowProps) {
  const cases = useCaseStore((s) => s.items);
  const linkedCase = task.caseId ? cases.find((c) => c.id === task.caseId) : undefined;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-1 py-2 transition-colors hover:bg-white/[0.03]"
      onClick={onClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskComplete(task.id);
        }}
        aria-label={task.completed ? "ยกเลิกงานเสร็จสิ้น" : "ทำเครื่องหมายว่าเสร็จสิ้น"}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          task.completed
            ? "border-success bg-success text-white"
            : "border-white/20 text-transparent hover:border-primary"
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: task.completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <Check className="size-3" strokeWidth={3} />
        </motion.span>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            task.completed && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {task.dueDate && <span>{formatThaiTime(task.dueDate)}</span>}
          {linkedCase && (
            <span className="inline-flex items-center gap-1 text-muted-foreground/80">
              <FolderClosed className="size-3" />
              {linkedCase.caseNumber}
            </span>
          )}
          {task.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <PriorityBadge priority={task.priority} className="shrink-0" />
    </div>
  );
}
