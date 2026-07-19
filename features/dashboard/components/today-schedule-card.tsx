"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { EventDetailsSheet } from "@/features/calendar/components/event-details-sheet";
import { useCalendarStore } from "@/store/calendar-store";
import { getTodayEvents } from "@/utils/calendar";
import { formatThaiTime } from "@/utils/date";
import { EVENT_CATEGORY_META } from "@/constants/calendar";
import type { CalendarEvent } from "@/types/calendar";

export function TodayScheduleCard() {
  const events = useCalendarStore((s) => s.items);
  const todayEvents = getTodayEvents(events);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>นัดหมายวันนี้</CardTitle>
        <CardAction>
          <Link href="/calendar" className="text-xs font-medium text-primary">
            ดูปฏิทิน
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {todayEvents.length === 0 ? (
          <EmptyState icon={CalendarClock} title="ไม่มีนัดหมายวันนี้" />
        ) : (
          <div>
            {todayEvents.map((event, index) => {
              const meta = EVENT_CATEGORY_META[event.category];
              return (
                <button
                  key={event.id}
                  onClick={() => setSelected(event)}
                  className="flex w-full gap-3 rounded-xl text-left transition-colors hover:bg-white/[0.03]"
                >
                  <div className="w-14 shrink-0 whitespace-nowrap pt-2 text-right text-xs font-medium text-muted-foreground">
                    {event.allDay ? "ทั้งวัน" : formatThaiTime(event.start)}
                  </div>
                  <div className="flex w-4 shrink-0 flex-col items-center">
                    <span
                      className="mt-2.5 size-2.5 shrink-0 rounded-full ring-4 ring-card"
                      style={{ backgroundColor: meta.color }}
                    />
                    {index < todayEvents.length - 1 && (
                      <span className="w-px flex-1 bg-white/[0.08]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-4 pt-1.5">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    <p className="text-xs" style={{ color: meta.color }}>
                      {meta.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>

      <EventDetailsSheet event={selected} onClose={() => setSelected(null)} />
    </Card>
  );
}
