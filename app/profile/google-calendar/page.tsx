import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { GoogleCalendarCard } from "@/features/profile/components/google-calendar-card";

export default function GoogleCalendarPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Google Calendar" description="เชื่อมต่อและซิงก์นัดหมายกับ Google Calendar" />
      <Suspense>
        <GoogleCalendarCard />
      </Suspense>
    </div>
  );
}
