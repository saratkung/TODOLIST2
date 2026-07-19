import type { Priority, ReminderOffset } from "@/types";
import type { RecurrenceRule } from "@/types/task";

export const PRIORITY_META: Record<
  Priority,
  { label: string; color: string; badgeClass: string }
> = {
  low: { label: "ต่ำ", color: "#22C55E", badgeClass: "bg-success/15 text-success" },
  medium: { label: "ปานกลาง", color: "#EAB308", badgeClass: "bg-[#EAB308]/15 text-[#EAB308]" },
  high: { label: "สูง", color: "#F59E0B", badgeClass: "bg-warning/15 text-warning" },
  urgent: { label: "ด่วนมาก", color: "#EF4444", badgeClass: "bg-danger/15 text-danger" },
};

export const PRIORITY_ORDER: Priority[] = ["urgent", "high", "medium", "low"];

export const PRESET_TASK_TAGS = ["ด่วน", "ฝากขัง", "พยาน", "ผู้ต้องหา", "เอกสาร", "โทรศัพท์"];

export type TaskSortMode = "custom" | "date" | "priority" | "newest" | "oldest";

export const TASK_SORT_META: Record<TaskSortMode, { label: string }> = {
  custom: { label: "จัดเรียงเอง" },
  date: { label: "วันที่ครบกำหนด" },
  priority: { label: "ความสำคัญ" },
  newest: { label: "ล่าสุด" },
  oldest: { label: "เก่าสุด" },
};

export const TASK_SORT_ORDER: TaskSortMode[] = ["custom", "date", "priority", "newest", "oldest"];

export const REMINDER_META: Record<ReminderOffset, { label: string; minutes: number }> = {
  "15m": { label: "ก่อน 15 นาที", minutes: 15 },
  "30m": { label: "ก่อน 30 นาที", minutes: 30 },
  "1h": { label: "ก่อน 1 ชั่วโมง", minutes: 60 },
  "1d": { label: "ก่อน 1 วัน", minutes: 60 * 24 },
  "7d": { label: "ก่อน 7 วัน", minutes: 60 * 24 * 7 },
};

export const RECURRENCE_META: Record<RecurrenceRule, { label: string }> = {
  none: { label: "ไม่ทำซ้ำ" },
  daily: { label: "ทุกวัน" },
  weekly: { label: "ทุกสัปดาห์" },
  monthly: { label: "ทุกเดือน" },
};
