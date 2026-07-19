"use client";

import { useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import "@/styles/fullcalendar.css";
import { useCalendarStore } from "@/store/calendar-store";
import { useUiStore } from "@/store/ui-store";
import { EVENT_CATEGORY_META } from "@/constants/calendar";
import type { CalendarEvent } from "@/types/calendar";

type ViewKind = "month" | "week" | "agenda";

const VIEW_MAP: Record<ViewKind, string> = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  agenda: "listMonth",
};

interface FullCalendarViewProps {
  view: ViewKind;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function FullCalendarView({ view, onSelectEvent }: FullCalendarViewProps) {
  const events = useCalendarStore((s) => s.items);
  const editEvent = useCalendarStore((s) => s.edit);
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);
  const calendarRef = useRef<FullCalendar | null>(null);

  const fcEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: e.allDay,
        backgroundColor: EVENT_CATEGORY_META[e.category].color,
        textColor: "#ffffff",
      })),
    [events]
  );

  function handleEventDrop(arg: EventDropArg) {
    const start = arg.event.start;
    const end = arg.event.end;
    if (!start) return;
    editEvent(arg.event.id, {
      start: start.toISOString(),
      end: end ? end.toISOString() : undefined,
    });
  }

  function handleEventResize(arg: EventResizeDoneArg) {
    const start = arg.event.start;
    const end = arg.event.end;
    if (!start) return;
    editEvent(arg.event.id, {
      start: start.toISOString(),
      end: end ? end.toISOString() : undefined,
    });
  }

  return (
    <div className="fc-wrap">
      <FullCalendar
        ref={calendarRef}
        key={view}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={VIEW_MAP[view]}
        headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
        height="auto"
        editable
        selectable
        events={fcEvents}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        dateClick={(arg) => {
          openCreateDialog("event", { start: arg.dateStr, allDay: arg.allDay });
        }}
        eventClick={(arg) => {
          const original = events.find((e) => e.id === arg.event.id);
          if (original) onSelectEvent(original);
        }}
        buttonText={{ today: "วันนี้" }}
        firstDay={1}
        locale="th"
      />
    </div>
  );
}
