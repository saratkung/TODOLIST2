"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoogleCalendarStore } from "@/store/google-calendar-store";
import { useGoogleSyncNow } from "@/features/calendar/hooks/use-google-sync-now";
import { cn } from "@/lib/utils";

export function GoogleSyncButton() {
  const router = useRouter();
  const status = useGoogleCalendarStore((s) => s.status);
  const checkStatus = useGoogleCalendarStore((s) => s.checkStatus);
  const { syncNow } = useGoogleSyncNow();
  const isConnected = status === "connected" || status === "syncing";

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  if (!isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/profile/google-calendar")}
        disabled={status === "checking"}
      >
        <RefreshCw className="size-3.5" /> เชื่อมต่อ Google Calendar
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={syncNow} disabled={status === "syncing"}>
      <RefreshCw className={cn("size-3.5", status === "syncing" && "animate-spin")} />
      {status === "syncing" ? "กำลังซิงก์..." : "Sync"}
    </Button>
  );
}
