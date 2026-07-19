"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/features/calendar/components/event-card";
import { EventDetailsSheet } from "@/features/calendar/components/event-details-sheet";
import { useUiStore } from "@/store/ui-store";
import type { CalendarEvent } from "@/types/calendar";

interface CaseRelatedAppointmentsProps {
  caseId: string;
  events: CalendarEvent[];
}

export function CaseRelatedAppointments({ caseId, events }: CaseRelatedAppointmentsProps) {
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="ยังไม่มีนัดหมายที่เกี่ยวข้อง"
          action={
            <Button size="sm" onClick={() => openCreateDialog("event", { caseId })}>
              เพิ่มนัดหมาย
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {sorted.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => setSelected(event)} />
          ))}
        </div>
      )}

      <EventDetailsSheet event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
