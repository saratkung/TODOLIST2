"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { GripVertical, Check, Trash2 } from "lucide-react";
import { TaskRow } from "@/features/tasks/components/task-row";
import { toggleTaskComplete } from "@/store/task-store";
import type { Task } from "@/types/task";

const SWIPE_THRESHOLD = 88;

interface SortableTaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableTaskItem({ task, onEdit, onDelete }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const completeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="relative"
    >
      <div className="absolute inset-0 flex items-center justify-between overflow-hidden rounded-2xl">
        <motion.div
          style={{ opacity: completeOpacity }}
          className="flex h-full w-24 items-center justify-start bg-success/20 pl-4 text-success"
        >
          <Check className="size-5" />
        </motion.div>
        <motion.div
          style={{ opacity: deleteOpacity }}
          className="flex h-full w-24 items-center justify-end bg-danger/20 pr-4 text-danger"
        >
          <Trash2 className="size-5" />
        </motion.div>
      </div>

      <motion.div
        style={{ x, opacity: isDragging ? 0.5 : 1 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          if (info.offset.x <= -SWIPE_THRESHOLD) {
            onDelete();
          } else if (info.offset.x >= SWIPE_THRESHOLD) {
            toggleTaskComplete(task.id);
          }
        }}
        className="relative flex items-center gap-1 rounded-2xl bg-background"
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-1.5 text-muted-foreground/50 active:cursor-grabbing"
          aria-label="ลากเพื่อจัดเรียง"
        >
          <GripVertical className="size-4" />
        </button>
        <div className="flex-1" onClick={onEdit}>
          <TaskRow task={task} />
        </div>
      </motion.div>
    </div>
  );
}
