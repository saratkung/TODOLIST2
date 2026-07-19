"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReminderSelector } from "@/features/calendar/components/reminder-selector";
import { EVENT_CATEGORY_META, EVENT_CATEGORY_ORDER } from "@/constants/calendar";
import { useCaseStore } from "@/store/case-store";
import type { CalendarEventInput } from "@/types/calendar";

const eventSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อรายการ"),
  start: z.string().min(1, "กรุณาเลือกวันและเวลา"),
  end: z.string().optional(),
  allDay: z.boolean(),
  category: z.enum(["investigation", "submission", "appointment", "custody", "meeting"]),
  caseId: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  reminder: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (input: CalendarEventInput) => void;
  submitLabel?: string;
}

export function EventForm({ defaultValues, onSubmit, submitLabel = "สร้างนัดหมาย" }: EventFormProps) {
  const cases = useCaseStore((s) => s.items);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      category: "appointment",
      allDay: false,
      ...defaultValues,
    },
  });

  const category = watch("category");
  const allDay = watch("allDay");
  const caseId = watch("caseId");
  const reminder = watch("reminder");

  function submit(values: EventFormValues) {
    onSubmit({
      title: values.title,
      start: new Date(values.start).toISOString(),
      end: values.end ? new Date(values.end).toISOString() : undefined,
      allDay: values.allDay,
      category: values.category,
      caseId: values.caseId || undefined,
      location: values.location || undefined,
      notes: values.notes || undefined,
      reminder: (values.reminder as CalendarEventInput["reminder"]) || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="event-title">ชื่อรายการ</Label>
        <Input id="event-title" {...register("title")} />
        {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>ประเภท</Label>
        <Select value={category} onValueChange={(v) => v && setValue("category", v as EventFormValues["category"])}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {(v: string) =>
                v && `${EVENT_CATEGORY_META[v as keyof typeof EVENT_CATEGORY_META]?.emoji} ${EVENT_CATEGORY_META[v as keyof typeof EVENT_CATEGORY_META]?.label}`
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {EVENT_CATEGORY_ORDER.map((key) => (
              <SelectItem key={key} value={key}>
                {EVENT_CATEGORY_META[key].emoji} {EVENT_CATEGORY_META[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
        <Label htmlFor="allDay" className="text-sm font-normal">ทั้งวัน</Label>
        <Switch id="allDay" checked={allDay} onCheckedChange={(v) => setValue("allDay", v)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start">{allDay ? "วันที่" : "เริ่ม"}</Label>
          <Input id="start" type={allDay ? "date" : "datetime-local"} {...register("start")} />
          {errors.start && <p className="text-xs text-danger">{errors.start.message}</p>}
        </div>
        {!allDay && (
          <div className="space-y-1.5">
            <Label htmlFor="end">สิ้นสุด</Label>
            <Input id="end" type="datetime-local" {...register("end")} />
          </div>
        )}
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

      <div className="space-y-1.5">
        <Label htmlFor="location">สถานที่</Label>
        <Input id="location" placeholder="เช่น ศาลอาญา, สภ.เมือง" {...register("location")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">บันทึกเพิ่มเติม</Label>
        <Textarea id="notes" rows={2} {...register("notes")} />
      </div>

      <ReminderSelector
        value={reminder as CalendarEventInput["reminder"]}
        onChange={(v) => setValue("reminder", v)}
      />

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
