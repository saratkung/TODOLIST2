"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagPicker } from "@/features/tasks/components/tag-picker";
import { ReminderSelector } from "@/features/calendar/components/reminder-selector";
import { PRIORITY_META, PRIORITY_ORDER, RECURRENCE_META } from "@/constants/task";
import { useCaseStore } from "@/store/case-store";
import { useCalendarStore } from "@/store/calendar-store";
import { formatThaiDate, formatThaiTime } from "@/utils/date";
import type { TaskInput } from "@/types/task";
import type { ReminderOffset } from "@/types/common";

const taskSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่องาน"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional(),
  reminder: z.string().optional(),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]),
  caseId: z.string().optional(),
  calendarEventId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  defaultTags?: string[];
  onSubmit: (input: TaskInput) => void;
  submitLabel?: string;
}

export function TaskForm({
  defaultValues,
  defaultTags,
  onSubmit,
  submitLabel = "สร้างงาน",
}: TaskFormProps) {
  const cases = useCaseStore((s) => s.items);
  const events = useCalendarStore((s) => s.items);
  const [tags, setTags] = useState<string[]>(defaultTags ?? []);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
      recurrence: "none",
      ...defaultValues,
    },
  });

  const priority = watch("priority");
  const recurrence = watch("recurrence");
  const reminder = watch("reminder");
  const caseId = watch("caseId");
  const calendarEventId = watch("calendarEventId");

  function submit(values: TaskFormValues) {
    onSubmit({
      title: values.title,
      description: values.description || undefined,
      priority: values.priority,
      tags,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
      reminder: (values.reminder as TaskInput["reminder"]) || undefined,
      recurrence: values.recurrence,
      caseId: values.caseId || undefined,
      calendarEventId: values.calendarEventId || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">ชื่องาน</Label>
        <Input id="title" placeholder="เช่น สอบปากคำผู้เสียหาย" {...register("title")} />
        {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">รายละเอียด</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>ความสำคัญ</Label>
          <Select value={priority} onValueChange={(v) => v && setValue("priority", v as TaskFormValues["priority"])}>
            <SelectTrigger className="w-full">
              <SelectValue>{(v: string) => PRIORITY_META[v as keyof typeof PRIORITY_META]?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_ORDER.map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_META[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dueDate">กำหนดวัน/เวลา</Label>
          <Input id="dueDate" type="datetime-local" {...register("dueDate")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>ทำซ้ำ</Label>
        <Select value={recurrence} onValueChange={(v) => v && setValue("recurrence", v as TaskFormValues["recurrence"])}>
          <SelectTrigger className="w-full">
            <SelectValue>{(v: string) => RECURRENCE_META[v as keyof typeof RECURRENCE_META]?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(RECURRENCE_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>แท็ก</Label>
        <TagPicker value={tags} onChange={setTags} />
      </div>

      {cases.length > 0 && (
        <div className="space-y-1.5">
          <Label>เชื่อมโยงคดี</Label>
          <Select value={caseId} onValueChange={(v) => setValue("caseId", !v || v === "none" ? undefined : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ไม่เชื่อมโยง">
                {(v: string | null) => {
                  if (!v || v === "none") return "ไม่เชื่อมโยง";
                  const match = cases.find((c) => c.id === v);
                  return match ? `${match.caseNumber} — ${match.title}` : "ไม่เชื่อมโยง";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">ไม่เชื่อมโยง</SelectItem>
              {cases.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.caseNumber} — {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-1.5">
          <Label>เชื่อมโยงนัดหมาย</Label>
          <Select
            value={calendarEventId}
            onValueChange={(v) => setValue("calendarEventId", !v || v === "none" ? undefined : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ไม่เชื่อมโยง">
                {(v: string | null) => {
                  if (!v || v === "none") return "ไม่เชื่อมโยง";
                  const match = events.find((e) => e.id === v);
                  return match ? `${match.title} — ${formatThaiDate(match.start)}` : "ไม่เชื่อมโยง";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">ไม่เชื่อมโยง</SelectItem>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.title} — {formatThaiDate(e.start)}
                  {!e.allDay && ` ${formatThaiTime(e.start)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <ReminderSelector
        value={reminder as ReminderOffset | undefined}
        onChange={(v) => setValue("reminder", v)}
      />

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
