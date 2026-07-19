"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MonthOverview } from "@/features/calendar/components/month-overview";
import { FullCalendarView } from "@/features/calendar/components/full-calendar-view";
import { CalendarTimelineView } from "@/features/calendar/components/calendar-timeline-view";
import { EventDetailsSheet } from "@/features/calendar/components/event-details-sheet";
import { EVENT_CATEGORY_META, EVENT_CATEGORY_ORDER } from "@/constants/calendar";
import type { CalendarEvent } from "@/types/calendar";

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  return (
    <div className="space-y-5">
      <PageHeader title="Calendar" description="ปฏิทินนัดหมายและกำหนดการ" />

      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {EVENT_CATEGORY_ORDER.map((key) => {
          const meta = EVENT_CATEGORY_META[key];
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full" style={{ backgroundColor: meta.color }} />
              {meta.label}
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="overview">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
          <TabsList>
            <TabsTrigger value="overview" className="shrink-0">วันนี้</TabsTrigger>
            <TabsTrigger value="month" className="shrink-0">เดือน</TabsTrigger>
            <TabsTrigger value="week" className="shrink-0">สัปดาห์</TabsTrigger>
            <TabsTrigger value="agenda" className="shrink-0">Agenda</TabsTrigger>
            <TabsTrigger value="timeline" className="shrink-0">Timeline</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="pt-4">
          <MonthOverview />
        </TabsContent>
        <TabsContent value="month" className="pt-4">
          <FullCalendarView view="month" onSelectEvent={setSelectedEvent} />
        </TabsContent>
        <TabsContent value="week" className="pt-4">
          <FullCalendarView view="week" onSelectEvent={setSelectedEvent} />
        </TabsContent>
        <TabsContent value="agenda" className="pt-4">
          <FullCalendarView view="agenda" onSelectEvent={setSelectedEvent} />
        </TabsContent>
        <TabsContent value="timeline" className="pt-4">
          <CalendarTimelineView onSelectEvent={setSelectedEvent} />
        </TabsContent>
      </Tabs>

      <EventDetailsSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
