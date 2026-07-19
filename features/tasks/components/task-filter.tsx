"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META, PRIORITY_ORDER, TASK_SORT_META, TASK_SORT_ORDER } from "@/constants/task";
import type { TaskSortMode } from "@/constants/task";

interface TaskFilterProps {
  priority: string;
  onPriorityChange: (value: string) => void;
  tag: string;
  onTagChange: (value: string) => void;
  availableTags: string[];
  sort: TaskSortMode;
  onSortChange: (value: TaskSortMode) => void;
}

export function TaskFilter({
  priority,
  onPriorityChange,
  tag,
  onTagChange,
  availableTags,
  sort,
  onSortChange,
}: TaskFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={priority} onValueChange={(v) => onPriorityChange(v ?? "all")}>
        <SelectTrigger className="w-[7.5rem]">
          <SelectValue>
            {(v: string) => (v === "all" ? "ความสำคัญ" : PRIORITY_META[v as keyof typeof PRIORITY_META]?.label)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          {PRIORITY_ORDER.map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_META[p].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={tag} onValueChange={(v) => onTagChange(v ?? "all")}>
        <SelectTrigger className="w-[7.5rem]">
          <SelectValue>{(v: string) => (v === "all" ? "แท็ก" : `#${v}`)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          {availableTags.map((t) => (
            <SelectItem key={t} value={t}>
              #{t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => v && onSortChange(v as TaskSortMode)}>
        <SelectTrigger className="w-[9rem]">
          <SlidersHorizontal className="size-3.5 shrink-0" />
          <SelectValue>{(v: string) => TASK_SORT_META[v as TaskSortMode]?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TASK_SORT_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {TASK_SORT_META[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
