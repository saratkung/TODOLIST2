"use client";

import Link from "next/link";
import { ListChecks, Trash2 } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/shared/progress-ring";
import { PriorityBadge } from "@/features/tasks/components/priority-badge";
import { StatusBadge } from "@/features/cases/components/status-badge";
import { useChecklistStore } from "@/store/checklist-store";
import { useTaskStore } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";
import { caseProgress } from "@/utils/case";
import { formatThaiDate } from "@/utils/date";
import type { CaseFile } from "@/types/case";

const SWIPE_THRESHOLD = 88;

export function CaseCard({ caseFile }: { caseFile: CaseFile }) {
  const checklist = useChecklistStore((s) => s.items);
  const tasks = useTaskStore((s) => s.items);
  const removeCase = useCaseStore((s) => s.remove);
  const progress = caseProgress(caseFile.id, checklist);
  const taskCount = tasks.filter((t) => t.caseId === caseFile.id).length;

  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-end overflow-hidden rounded-[20px]">
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
            removeCase(caseFile.id);
          }
        }}
        className="relative"
      >
        <Link href={`/cases/${caseFile.id}`} draggable={false}>
          <Card className="transition-transform active:scale-[0.98]">
            <CardContent className="flex items-center gap-4">
              <ProgressRing
                value={progress}
                size={52}
                strokeWidth={5}
                label={<span className="text-xs font-semibold">{progress}%</span>}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-muted-foreground">{caseFile.caseNumber}</p>
                  <PriorityBadge priority={caseFile.priority} />
                </div>
                <p className="truncate text-sm font-medium">{caseFile.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {caseFile.category} · สร้าง {formatThaiDate(caseFile.createdAt)}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <StatusBadge status={caseFile.status} />
                  {taskCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <ListChecks className="size-3" />
                      {taskCount} งาน
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
