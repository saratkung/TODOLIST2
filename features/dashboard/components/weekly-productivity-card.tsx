"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/store/task-store";

const WEEKDAY_LABELS = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

function buildWeekData(tasks: ReturnType<typeof useTaskStore.getState>["items"]) {
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayIndex = (today.getDay() + 6) % 7; // Monday = 0
  startOfWeek.setDate(today.getDate() - dayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  return WEEKDAY_LABELS.map((label, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const completed = tasks.filter(
      (t) =>
        t.completed &&
        new Date(t.updatedAt).getTime() >= day.getTime() &&
        new Date(t.updatedAt).getTime() < nextDay.getTime()
    ).length;

    return { day: label, completed };
  });
}

export function WeeklyProductivityCard() {
  const tasks = useTaskStore((s) => s.items);
  const data = buildWeekData(tasks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ประสิทธิภาพรายสัปดาห์</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#A1A1AA", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#19191B",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "#fff",
                }}
                labelStyle={{ color: "#A1A1AA" }}
              />
              <Bar dataKey="completed" name="งานที่เสร็จ" fill="#DC2626" radius={[6, 6, 6, 6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
