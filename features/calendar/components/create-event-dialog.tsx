"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/ui-store";
import { useCalendarStore } from "@/store/calendar-store";
import { EventForm, type EventFormValues } from "@/features/calendar/components/event-form";
import { googleCalendarSyncService, CalendarSyncError } from "@/services/google-calendar-sync-service";
import type { CalendarEventInput } from "@/types/calendar";

export function CreateEventDialog() {
  const isOpen = useUiStore((s) => s.createDialog === "event");
  const closeCreateDialog = useUiStore((s) => s.closeCreateDialog);
  const defaults = useUiStore((s) => s.createDialogDefaults);
  const addEvent = useCalendarStore((s) => s.add);
  const editEvent = useCalendarStore((s) => s.edit);

  async function handleSubmit(input: CalendarEventInput, syncToGoogle: boolean) {
    const created = await addEvent(input);
    toast.success("สร้างนัดหมายเรียบร้อยแล้ว");
    closeCreateDialog();

    if (syncToGoogle) {
      try {
        const { googleEventId } = await googleCalendarSyncService.createEvent(created);
        await editEvent(created.id, {
          googleEventId,
          syncStatus: "synced",
          lastSyncedAt: new Date().toISOString(),
        });
        toast.success("ซิงก์ไปยัง Google Calendar แล้ว");
      } catch (error) {
        const message = error instanceof CalendarSyncError ? error.message : "ซิงก์ไปยัง Google Calendar ไม่สำเร็จ";
        toast.error(message);
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>สร้างนัดหมายใหม่</DialogTitle>
        </DialogHeader>
        {isOpen && (
          <EventForm onSubmit={handleSubmit} defaultValues={defaults as Partial<EventFormValues>} />
        )}
      </DialogContent>
    </Dialog>
  );
}
