"use client";

import { useClientNow } from "@/hooks/use-client-now";
import { EVENT_CATEGORY_META } from "@/constants/calendar";
import { formatThaiTime } from "@/utils/date";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/calendar";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const meta = EVENT_CATEGORY_META[event.category];
  const now = useClientNow();
  const startMs = new Date(event.start).getTime();
  const endMs = event.end ? new Date(event.end).getTime() : startMs;
  const isPast = now !== null && !event.allDay && endMs < now.getTime();
  const isOngoing = now !== null && !event.allDay && startMs <= now.getTime() && now.getTime() <= endMs;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl bg-card px-3 py-3 text-left shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06] transition-transform active:scale-[0.98]",
        isPast && "opacity-50"
      )}
    >
      <div className="w-14 shrink-0 whitespace-nowrap text-xs font-medium text-muted-foreground">
        {event.allDay ? "ทั้งวัน" : formatThaiTime(event.start)}
      </div>
      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{event.title}</p>
        <p className="truncate text-xs" style={{ color: meta.color }}>
          {meta.label}
        </p>
      </div>
      {isOngoing && (
        <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
          กำลังดำเนินการ
        </span>
      )}
      {isPast && (
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          ผ่านไปแล้ว
        </span>
      )}
    </button>
  );
}
