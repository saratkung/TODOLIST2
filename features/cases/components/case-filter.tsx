"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META, PRIORITY_ORDER } from "@/constants/task";
import {
  CASE_STATUS_META,
  CASE_STATUS_ORDER,
  CASE_CATEGORIES,
  CASE_SORT_META,
  CASE_SORT_ORDER,
} from "@/constants/case";
import type { CaseSortMode } from "@/constants/case";

interface CaseFilterProps {
  status: string;
  onStatusChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  sort: CaseSortMode;
  onSortChange: (value: CaseSortMode) => void;
}

export function CaseFilter({
  status,
  onStatusChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
}: CaseFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={status} onValueChange={(v) => onStatusChange(v ?? "all")}>
        <SelectTrigger className="w-[8rem]">
          <SelectValue>
            {(v: string) => (v === "all" ? "สถานะ" : CASE_STATUS_META[v as keyof typeof CASE_STATUS_META]?.label)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          {CASE_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {CASE_STATUS_META[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={(v) => onCategoryChange(v ?? "all")}>
        <SelectTrigger className="w-[8rem]">
          <SelectValue>{(v: string) => (v === "all" ? "ประเภทคดี" : v)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          {CASE_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      <Select value={sort} onValueChange={(v) => v && onSortChange(v as CaseSortMode)}>
        <SelectTrigger className="w-[9rem]">
          <SlidersHorizontal className="size-3.5 shrink-0" />
          <SelectValue>{(v: string) => CASE_SORT_META[v as CaseSortMode]?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {CASE_SORT_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {CASE_SORT_META[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
