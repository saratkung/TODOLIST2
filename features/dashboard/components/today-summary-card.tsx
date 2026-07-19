"use client";

import { motion } from "framer-motion";
import { ListChecks, CalendarClock, Flame, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/store/task-store";
import { useCalendarStore } from "@/store/calendar-store";
import { useCaseStore } from "@/store/case-store";
import { getTodayTasks, getOverdueTasks, completionPercent } from "@/utils/task";
import { getTodayEvents } from "@/utils/calendar";
import { isWithinNextDays } from "@/utils/date";

export function TodaySummaryCard() {
  const tasks = useTaskStore((s) => s.items);
  const events = useCalendarStore((s) => s.items);
  const cases = useCaseStore((s) => s.items);

  const todayTasks = getTodayTasks(tasks);
  const todayEvents = getTodayEvents(events);
  const percent = completionPercent(todayTasks);

  const overdueTasks = getOverdueTasks(tasks);
  const urgentPriorityToday = todayTasks.filter((t) => !t.completed && t.priority === "urgent");
  const custodyCases = cases.filter(
    (c) => c.custodyDeadline && isWithinNextDays(c.custodyDeadline, 2)
  );
  const urgentIds = new Set([
    ...overdueTasks.map((t) => t.id),
    ...urgentPriorityToday.map((t) => t.id),
  ]);
  const urgentCount = urgentIds.size + custodyCases.length;

  const stats = [
    { icon: ListChecks, label: "งานวันนี้", value: `${todayTasks.length} งาน`, tint: "#2563EB" },
    { icon: CalendarClock, label: "นัดหมาย", value: `${todayEvents.length} รายการ`, tint: "#F59E0B" },
    { icon: Flame, label: "งานด่วน", value: `${urgentCount} งาน`, tint: "#EF4444" },
    { icon: CheckCircle2, label: "ทำเสร็จแล้ว", value: `${percent}%`, tint: "#22C55E" },
  ];

  return (
    <Card>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground">สรุปวันนี้</p>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${stat.tint}26`, color: stat.tint }}
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold leading-tight">{stat.value}</p>
                  <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
