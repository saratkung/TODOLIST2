import { PageHeader } from "@/components/shared/page-header";
import { StatsGrid } from "@/features/analytics/components/stats-grid";
import { WeeklyProductivityCard } from "@/features/dashboard/components/weekly-productivity-card";
import { MonthlyChart } from "@/features/analytics/components/monthly-chart";
import { ProductivityHeatmap } from "@/features/analytics/components/productivity-heatmap";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="ภาพรวมประสิทธิภาพการทำงาน" />
      <StatsGrid />
      <WeeklyProductivityCard />
      <MonthlyChart />
      <ProductivityHeatmap />
    </div>
  );
}
