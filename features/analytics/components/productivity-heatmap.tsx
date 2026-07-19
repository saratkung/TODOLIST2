"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/store/task-store";

const WEEKS = 12;

function levelClass(count: number): string {
  if (count === 0) return "bg-white/[0.05]";
  if (count === 1) return "bg-primary/30";
  if (count === 2) return "bg-primary/55";
  if (count === 3) return "bg-primary/80";
  return "bg-primary";
}

function buildHeatmapData(tasks: ReturnType<typeof useTaskStore.getState>["items"]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = WEEKS * 7;
  const start = new Date(today);
  start.setDate(today.getDate() - totalDays + 1);
  const startOffset = (start.getDay() + 6) % 7; // align to Monday
  start.setDate(start.getDate() - startOffset);

  const days: { date: Date; count: number }[] = [];
  for (let i = 0; i < totalDays + startOffset; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const count = tasks.filter(
      (t) =>
        t.completed &&
        new Date(t.updatedAt).getTime() >= date.getTime() &&
        new Date(t.updatedAt).getTime() < nextDate.getTime()
    ).length;
    days.push({ date, count });
  }

  const weeks: { date: Date; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function ProductivityHeatmap() {
  const tasks = useTaskStore((s) => s.items);
  const weeks = buildHeatmapData(tasks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day.date.toLocaleDateString("th-TH")}
                  className={`size-3 rounded-[3px] ${levelClass(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>น้อย</span>
          <span className="size-2.5 rounded-[2px] bg-white/[0.05]" />
          <span className="size-2.5 rounded-[2px] bg-primary/30" />
          <span className="size-2.5 rounded-[2px] bg-primary/55" />
          <span className="size-2.5 rounded-[2px] bg-primary/80" />
          <span className="size-2.5 rounded-[2px] bg-primary" />
          <span>มาก</span>
        </div>
      </CardContent>
    </Card>
  );
}
