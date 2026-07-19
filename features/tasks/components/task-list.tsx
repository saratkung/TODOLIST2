"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
import { SortableTaskItem } from "@/features/tasks/components/sortable-task-item";
import { SwipeableTaskRow } from "@/features/tasks/components/swipeable-task-row";
import { useTaskStore, reorderTasks } from "@/store/task-store";
import { sortByOrder, sortByDueDate, sortByPriority, sortByNewest, sortByOldest } from "@/utils/task";
import { cn } from "@/lib/utils";
import type { TaskGroups } from "@/utils/task";
import type { TaskSortMode } from "@/constants/task";
import type { Task } from "@/types/task";

const SECTIONS: { key: keyof TaskGroups; label: string }[] = [
  { key: "overdue", label: "เลยกำหนด" },
  { key: "today", label: "วันนี้" },
  { key: "tomorrow", label: "พรุ่งนี้" },
  { key: "thisWeek", label: "สัปดาห์นี้" },
  { key: "later", label: "ไม่มีกำหนด / ภายหลัง" },
  { key: "completed", label: "เสร็จแล้ว" },
];

const DEFAULT_COLLAPSED = new Set<keyof TaskGroups>(["later", "completed"]);

function applySort(tasks: Task[], sort: TaskSortMode): Task[] {
  switch (sort) {
    case "date":
      return sortByDueDate(tasks);
    case "priority":
      return sortByPriority(tasks);
    case "newest":
      return sortByNewest(tasks);
    case "oldest":
      return sortByOldest(tasks);
    default:
      return sortByOrder(tasks);
  }
}

interface TaskListProps {
  groups: TaskGroups;
  sort: TaskSortMode;
  onEditTask: (task: Task) => void;
}

export function TaskList({ groups, sort, onEditTask }: TaskListProps) {
  const removeTask = useTaskStore((s) => s.remove);
  const [collapsed, setCollapsed] = useState<Set<keyof TaskGroups>>(DEFAULT_COLLAPSED);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function toggleSection(key: keyof TaskGroups) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleDragEnd(sectionTasks: Task[], event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionTasks.findIndex((t) => t.id === active.id);
    const newIndex = sectionTasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(sectionTasks, oldIndex, newIndex);
    reorderTasks(reordered.map((t) => t.id));
  }

  return (
    <div className="space-y-5">
      {SECTIONS.map(({ key, label }) => {
        const rawTasks = groups[key];
        if (rawTasks.length === 0) return null;
        const tasks = applySort(rawTasks, sort);
        const isCollapsed = collapsed.has(key);

        return (
          <div key={key} className="space-y-2">
            <button
              onClick={() => toggleSection(key)}
              className="flex w-full items-center justify-between px-1 text-left"
            >
              <p
                className={cn(
                  "text-xs font-semibold text-muted-foreground",
                  key === "overdue" && "text-danger"
                )}
              >
                {label} ({tasks.length})
              </p>
              <motion.span
                animate={{ rotate: isCollapsed ? -90 : 0 }}
                className="text-muted-foreground"
              >
                <ChevronDown className="size-4" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  {sort === "custom" ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(e) => handleDragEnd(tasks, e)}
                    >
                      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-1.5">
                          {tasks.map((task) => (
                            <SortableTaskItem
                              key={task.id}
                              task={task}
                              onEdit={() => onEditTask(task)}
                              onDelete={() => removeTask(task.id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="space-y-1.5">
                      {tasks.map((task) => (
                        <SwipeableTaskRow key={task.id} task={task} onEdit={() => onEditTask(task)} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
