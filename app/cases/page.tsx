"use client";

import { useMemo, useState } from "react";
import { Plus, FolderClosed } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { CaseSearch } from "@/features/cases/components/case-search";
import { CaseFilter } from "@/features/cases/components/case-filter";
import { CaseList } from "@/features/cases/components/case-list";
import { CaseListSkeleton } from "@/features/cases/components/case-list-skeleton";
import { useCaseStore } from "@/store/case-store";
import { useChecklistStore } from "@/store/checklist-store";
import { useUiStore } from "@/store/ui-store";
import {
  caseProgress,
  sortCasesByCreatedAt,
  sortCasesByCaseNumber,
  sortCasesByPriority,
  sortCasesByProgress,
} from "@/utils/case";
import type { CaseSortMode } from "@/constants/case";

export default function CasesPage() {
  const cases = useCaseStore((s) => s.items);
  const hydrated = useCaseStore((s) => s.hydrated);
  const checklist = useChecklistStore((s) => s.items);
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sort, setSort] = useState<CaseSortMode>("createdAt");

  const progressById = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of cases) map.set(c.id, caseProgress(c.id, checklist));
    return map;
  }, [cases, checklist]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      const matchesQuery =
        q === "" ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.victim?.toLowerCase().includes(q) ||
        c.suspect?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
      const matchesPriority = priorityFilter === "all" || c.priority === priorityFilter;
      return matchesQuery && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [cases, query, statusFilter, categoryFilter, priorityFilter]);

  const sorted = useMemo(() => {
    switch (sort) {
      case "caseNumber":
        return sortCasesByCaseNumber(filtered);
      case "priority":
        return sortCasesByPriority(filtered);
      case "progress":
        return sortCasesByProgress(filtered, progressById);
      default:
        return sortCasesByCreatedAt(filtered);
    }
  }, [filtered, sort, progressById]);

  const isEmpty = cases.length === 0;
  const noResults = !isEmpty && sorted.length === 0;

  function handleAddCase() {
    openCreateDialog("case");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cases"
        description="คดีทั้งหมดที่รับผิดชอบ"
        action={
          <Button size="icon" onClick={handleAddCase} aria-label="สร้างคดีใหม่">
            <Plus className="size-4" />
          </Button>
        }
      />

      <div className="space-y-2.5">
        <CaseSearch value={query} onChange={setQuery} />
        <CaseFilter
          status={statusFilter}
          onStatusChange={setStatusFilter}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {!hydrated ? (
        <CaseListSkeleton />
      ) : isEmpty ? (
        <EmptyState
          icon={FolderClosed}
          title="ยังไม่มีคดี"
          action={
            <Button size="sm" onClick={handleAddCase}>
              สร้างคดีแรก
            </Button>
          }
        />
      ) : noResults ? (
        <EmptyState icon={FolderClosed} title="ไม่พบคดี" description="ลองเปลี่ยนคำค้นหาหรือตัวกรอง" />
      ) : (
        <CaseList cases={sorted} />
      )}
    </div>
  );
}
