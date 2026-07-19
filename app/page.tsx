import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { TodaySummaryCard } from "@/features/dashboard/components/today-summary-card";
import { TodayScheduleCard } from "@/features/dashboard/components/today-schedule-card";
import { TodayTasksCard } from "@/features/dashboard/components/today-tasks-card";
import { RecentCasesCard } from "@/features/dashboard/components/recent-cases-card";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardHeader />
      <TodaySummaryCard />
      <TodayScheduleCard />
      <TodayTasksCard />
      <RecentCasesCard />
    </div>
  );
}
