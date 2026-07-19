import { startOfDay, addDays, endOfWeek } from "date-fns";
import type { Task } from "@/types/task";
import { PRIORITY_ORDER } from "@/constants/task";
import { isToday, isWithinNextDays, isSameDay } from "@/utils/date";

export function getTodayTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.dueDate && isToday(t.dueDate));
}

export function getUpcomingTasks(tasks: Task[], days = 7): Task[] {
  return tasks.filter(
    (t) => !t.completed && t.dueDate && !isToday(t.dueDate) && isWithinNextDays(t.dueDate, days)
  );
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  const now = Date.now();
  return tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate).getTime() < now);
}

export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  );
}

export function sortByOrder(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.order - b.order);
}

export function sortByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function sortByNewest(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function sortByOldest(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function completionPercent(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

export interface TaskGroups {
  overdue: Task[];
  today: Task[];
  tomorrow: Task[];
  thisWeek: Task[];
  later: Task[];
  completed: Task[];
}

/** Buckets tasks by due date for the grouped Tasks page view. */
export function groupTasksByDueDate(tasks: Task[]): TaskGroups {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrow = addDays(todayStart, 1);
  const weekEnd = endOfWeek(now);

  const groups: TaskGroups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    completed: [],
  };

  for (const task of tasks) {
    if (task.completed) {
      groups.completed.push(task);
      continue;
    }
    if (!task.dueDate) {
      groups.later.push(task);
      continue;
    }
    const due = new Date(task.dueDate);
    if (due < todayStart) {
      groups.overdue.push(task);
    } else if (isSameDay(due, now)) {
      groups.today.push(task);
    } else if (isSameDay(due, tomorrow)) {
      groups.tomorrow.push(task);
    } else if (due <= weekEnd) {
      groups.thisWeek.push(task);
    } else {
      groups.later.push(task);
    }
  }

  return groups;
}
