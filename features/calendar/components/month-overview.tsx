"use client";

import { useState } from "react";
import { isSameDay } from "date-fns";
import { Plus } from "lucide-react";
import { MonthGrid } from "@/features/calendar/components/month-grid";
import { AgendaList } from "@/features/calendar/components/agenda-list";
import { AgendaSkeleton } from "@/features/calendar/components/agenda-skeleton";
import { EventDetailsSheet } from "@/features/calendar/components/event-details-sheet";
import { GoogleSyncButton } from "@/features/calendar/components/google-sync-button";
import { useCalendarStore } from "@/store/calendar-store";
import { useUiStore } from "@/store/ui-store";
import { formatThaiDateLong } from "@/utils/date";
import type { CalendarEvent } from "@/types/calendar";

function toLocalDateInput(date: Date, hour: string) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T${hour}`;
}

export function MonthOverview() {
  const events = useCalendarStore((s) => s.items);
  const hydrated = useCalendarStore((s) => s.hydrated);
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);

  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const dayEvents = events
    .filter((e) => isSameDay(new Date(e.start), selectedDate))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  function handleAddForSelectedDate() {
    openCreateDialog("event", { start: toLocalDateInput(selectedDate, "09:00") });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] bg-card p-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06]">
        <MonthGrid
          month={month}
          selectedDate={selectedDate}
          events={events}
          onSelectDate={setSelectedDate}
          onChangeMonth={setMonth}
          headerAction={<GoogleSyncButton />}
        />
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold">{formatThaiDateLong(selectedDate)}</p>
          <button
            onClick={handleAddForSelectedDate}
            aria-label="เพิ่มนัดหมาย"
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            <Plus className="size-3.5" strokeWidth={2} />
            เพิ่มนัดหมาย
          </button>
        </div>

        {!hydrated ? (
          <AgendaSkeleton />
        ) : (
          <AgendaList
            events={dayEvents}
            onSelectEvent={setSelectedEvent}
            onAddEvent={handleAddForSelectedDate}
          />
        )}
      </div>

      <EventDetailsSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
