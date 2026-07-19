"use client";

import { motion } from "framer-motion";
import { useCalendarStore } from "@/store/calendar-store";
import { EmptyState } from "@/components/shared/empty-state";
import { EVENT_CATEGORY_META } from "@/constants/calendar";
import { formatThaiDate, formatThaiTime } from "@/utils/date";
import { CalendarClock } from "lucide-react";
import type { CalendarEvent } from "@/types/calendar";

function groupByDay(events: CalendarEvent[]) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  const groups = new Map<string, CalendarEvent[]>();
  for (const e of sorted) {
    const key = new Date(e.start).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  return Array.from(groups.entries());
}

export function CalendarTimelineView({ onSelectEvent }: { onSelectEvent: (e: CalendarEvent) => void }) {
  const events = useCalendarStore((s) => s.items);
  const groups = groupByDay(events);

  if (groups.length === 0) {
    return <EmptyState icon={CalendarClock} title="ยังไม่มีรายการในปฏิทิน" />;
  }

  return (
    <div className="space-y-6">
      {groups.map(([day, dayEvents], groupIndex) => (
        <div key={day} className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">{formatThaiDate(day)}</p>
          <div className="relative space-y-4 border-l border-white/10 pl-5">
            {dayEvents.map((event, index) => {
              const meta = EVENT_CATEGORY_META[event.category];
              return (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * dayEvents.length + index) * 0.03 }}
                  onClick={() => onSelectEvent(event)}
                  className="relative block w-full text-left"
                >
                  <span
                    className="absolute -left-[26px] top-1.5 size-3 rounded-full ring-4 ring-background"
                    style={{ backgroundColor: meta.color }}
                  />
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.allDay ? "ทั้งวัน" : formatThaiTime(event.start)} · {meta.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
