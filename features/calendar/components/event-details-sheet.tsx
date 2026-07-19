"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil, Copy, MapPin, Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventForm } from "@/features/calendar/components/event-form";
import { useCalendarStore } from "@/store/calendar-store";
import { EVENT_CATEGORY_META } from "@/constants/calendar";
import { REMINDER_META } from "@/constants/task";
import { formatThaiDate, formatThaiTime } from "@/utils/date";
import type { CalendarEvent, CalendarEventInput } from "@/types/calendar";

interface EventDetailsSheetProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventDetailsSheet({ event, onClose }: EventDetailsSheetProps) {
  const [editing, setEditing] = useState(false);
  const editEvent = useCalendarStore((s) => s.edit);
  const removeEvent = useCalendarStore((s) => s.remove);
  const addEvent = useCalendarStore((s) => s.add);

  if (!event) return null;
  const meta = EVENT_CATEGORY_META[event.category];

  async function handleUpdate(input: CalendarEventInput) {
    if (!event) return;
    await editEvent(event.id, input);
    toast.success("บันทึกการเปลี่ยนแปลงแล้ว");
    setEditing(false);
    onClose();
  }

  async function handleDelete() {
    if (!event) return;
    await removeEvent(event.id);
    toast.success("ลบนัดหมายแล้ว");
    onClose();
  }

  async function handleDuplicate() {
    if (!event) return;
    const { title, start, end, allDay, category, caseId, notes, location, reminder } = event;
    await addEvent({ title, start, end, allDay, category, caseId, notes, location, reminder });
    toast.success("ทำซ้ำนัดหมายแล้ว");
    onClose();
  }

  return (
    <Sheet open={!!event} onOpenChange={(open) => !open && (setEditing(false), onClose())}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[24px]">
        <SheetHeader>
          <SheetTitle>{editing ? "แก้ไขนัดหมาย" : event.title}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          {editing ? (
            <EventForm
              submitLabel="บันทึกการเปลี่ยนแปลง"
              defaultValues={{
                title: event.title,
                start: event.start.slice(0, 16),
                end: event.end?.slice(0, 16),
                allDay: event.allDay,
                category: event.category,
                caseId: event.caseId,
                notes: event.notes,
                location: event.location,
                reminder: event.reminder,
              }}
              onSubmit={handleUpdate}
            />
          ) : (
            <div className="space-y-4">
              <Badge className={`border-0 ${meta.badgeClass}`}>
                {meta.emoji} {meta.label}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {formatThaiDate(event.start)}
                {!event.allDay && ` · ${formatThaiTime(event.start)}`}
              </p>
              {event.location && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {event.location}
                </p>
              )}
              {event.reminder && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Bell className="size-3.5 shrink-0" />
                  แจ้งเตือน{REMINDER_META[event.reminder].label}
                </p>
              )}
              {event.notes && <p className="text-sm">{event.notes}</p>}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(true)}>
                  <Pencil className="size-4" /> แก้ไข
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleDuplicate}>
                  <Copy className="size-4" /> ทำซ้ำ
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                  <Trash2 className="size-4" /> ลบ
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
