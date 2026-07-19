"use client";

import { CalendarClock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/features/calendar/components/event-card";
import type { CalendarEvent } from "@/types/calendar";

interface AgendaListProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onAddEvent: () => void;
}

export function AgendaList({ events, onSelectEvent, onAddEvent }: AgendaListProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="ไม่มีนัดหมายวันนี้"
        action={
          <Button size="sm" onClick={onAddEvent}>
            เพิ่มนัดหมาย
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />
      ))}
    </div>
  );
}
