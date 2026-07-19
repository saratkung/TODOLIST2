"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { TaskRow } from "@/features/tasks/components/task-row";
import { toggleTaskComplete, useTaskStore } from "@/store/task-store";
import type { Task } from "@/types/task";

const SWIPE_THRESHOLD = 88;

interface SwipeableTaskRowProps {
  task: Task;
  onEdit?: () => void;
}

export function SwipeableTaskRow({ task, onEdit }: SwipeableTaskRowProps) {
  const removeTask = useTaskStore((s) => s.remove);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const completeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-between overflow-hidden rounded-2xl">
        <motion.div
          style={{ opacity: completeOpacity }}
          className="flex h-full w-20 items-center justify-start bg-success/20 pl-4 text-success"
        >
          <Check className="size-5" />
        </motion.div>
        <motion.div
          style={{ opacity: deleteOpacity }}
          className="flex h-full w-20 items-center justify-end bg-danger/20 pr-4 text-danger"
        >
          <Trash2 className="size-5" />
        </motion.div>
      </div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(_, info) => {
          if (info.offset.x <= -SWIPE_THRESHOLD) {
            removeTask(task.id);
          } else if (info.offset.x >= SWIPE_THRESHOLD) {
            toggleTaskComplete(task.id);
          }
        }}
        className="relative rounded-2xl bg-card"
      >
        <TaskRow task={task} onClick={onEdit} />
      </motion.div>
    </div>
  );
}
