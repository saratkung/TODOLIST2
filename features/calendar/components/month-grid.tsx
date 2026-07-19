"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { th } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORY_META } from "@/constants/calendar";
import type { CalendarEvent, EventCategory } from "@/types/calendar";

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

interface MonthGridProps {
  month: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
}

export function MonthGrid({
  month,
  selectedDate,
  events,
  onSelectDate,
  onChangeMonth,
}: MonthGridProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function categoriesForDay(day: Date): EventCategory[] {
    const categories = new Set<EventCategory>();
    for (const event of events) {
      if (isSameDay(new Date(event.start), day)) categories.add(event.category);
    }
    return Array.from(categories).slice(0, 4);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => onChangeMonth(subMonths(month, 1))}
          aria-label="เดือนก่อนหน้า"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-semibold">
          {format(month, "MMMM", { locale: th })} {month.getFullYear() + 543}
        </p>
        <button
          onClick={() => onChangeMonth(addMonths(month, 1))}
          aria-label="เดือนถัดไป"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-[11px] font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const categories = categoriesForDay(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className="flex flex-col items-center gap-0.5 py-1"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm transition-colors",
                  !inMonth && "text-muted-foreground/30",
                  inMonth && !selected && "text-foreground",
                  selected && "bg-primary font-semibold text-primary-foreground",
                  !selected && today && "font-semibold text-primary ring-1 ring-primary"
                )}
              >
                {day.getDate()}
              </span>
              <span className="flex h-1.5 items-center gap-0.5">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="size-1 rounded-full"
                    style={{ backgroundColor: EVENT_CATEGORY_META[category].color }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
