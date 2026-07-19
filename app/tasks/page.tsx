"use client";

import { useMemo, useState } from "react";
import { Plus, ListTodo } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { TaskSearch } from "@/features/tasks/components/task-search";
import { TaskFilter } from "@/features/tasks/components/task-filter";
import { TaskList } from "@/features/tasks/components/task-list";
import { TaskListSkeleton } from "@/features/tasks/components/task-list-skeleton";
import { EditTaskSheet } from "@/features/tasks/components/edit-task-sheet";
import { useTaskStore } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";
import { useUiStore } from "@/store/ui-store";
import { groupTasksByDueDate } from "@/utils/task";
import type { TaskSortMode } from "@/constants/task";
import type { Task } from "@/types/task";

export default function TasksPage() {
  const tasks = useTaskStore((s) => s.items);
  const hydrated = useTaskStore((s) => s.hydrated);
  const cases = useCaseStore((s) => s.items);
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);

  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sort, setSort] = useState<TaskSortMode>("custom");
  const [editing, setEditing] = useState<Task | null>(null);

  const caseNumberById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of cases) map.set(c.id, c.caseNumber);
    return map;
  }, [cases]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) for (const tag of t.tags) set.add(tag);
    return Array.from(set).sort();
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const caseNumber = t.caseId ? caseNumberById.get(t.caseId) ?? "" : "";
      const matchesQuery =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        caseNumber.toLowerCase().includes(q);
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      const matchesTag = tagFilter === "all" || t.tags.includes(tagFilter);
      return matchesQuery && matchesPriority && matchesTag;
    });
  }, [tasks, query, priorityFilter, tagFilter, caseNumberById]);

  const groups = useMemo(() => groupTasksByDueDate(filtered), [filtered]);
  const isEmpty = tasks.length === 0;
  const noResults = !isEmpty && filtered.length === 0;

  function handleAddTask() {
    openCreateDialog("task");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tasks"
        description="งานทั้งหมดของคุณ"
        action={
          <Button size="icon" onClick={handleAddTask} aria-label="สร้างงานใหม่">
            <Plus className="size-4" />
          </Button>
        }
      />

      <div className="space-y-2.5">
        <TaskSearch value={query} onChange={setQuery} />
        <TaskFilter
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          tag={tagFilter}
          onTagChange={setTagFilter}
          availableTags={availableTags}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {!hydrated ? (
        <TaskListSkeleton />
      ) : isEmpty ? (
        <EmptyState
          icon={ListTodo}
          title="ยังไม่มีงาน"
          action={
            <Button size="sm" onClick={handleAddTask}>
              เพิ่มงาน
            </Button>
          }
        />
      ) : noResults ? (
        <EmptyState icon={ListTodo} title="ไม่พบงาน" description="ลองเปลี่ยนคำค้นหาหรือตัวกรอง" />
      ) : (
        <TaskList groups={groups} sort={sort} onEditTask={setEditing} />
      )}

      <EditTaskSheet task={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
