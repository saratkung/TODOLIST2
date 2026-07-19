"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/store/task-store";

function buildMonthData(tasks: ReturnType<typeof useTaskStore.getState>["items"]) {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayStart = new Date(now.getFullYear(), now.getMonth(), day);
    const dayEnd = new Date(now.getFullYear(), now.getMonth(), day + 1);
    const completed = tasks.filter(
      (t) =>
        t.completed &&
        new Date(t.updatedAt).getTime() >= dayStart.getTime() &&
        new Date(t.updatedAt).getTime() < dayEnd.getTime()
    ).length;
    return { day: String(day), completed };
  });
}

export function MonthlyChart() {
  const tasks = useTaskStore((s) => s.items);
  const data = buildMonthData(tasks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>แนวโน้มรายเดือน</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                interval={4}
                tick={{ fill: "#A1A1AA", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1C1E22",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "#fff",
                }}
                labelStyle={{ color: "#A1A1AA" }}
                labelFormatter={(label) => `วันที่ ${label}`}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="งานที่เสร็จ"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#monthlyFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
