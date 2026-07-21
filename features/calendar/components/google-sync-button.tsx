"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
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
      <button
        onClick={() => router.push("/profile/google-calendar")}
        aria-label="เชื่อมต่อ Google Calendar"
        title="เชื่อมต่อ Google Calendar"
        disabled={status === "checking"}
        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 disabled:opacity-50"
      >
        <RefreshCw className="size-4" />
      </button>
    );
  }

  return (
    <button
      onClick={syncNow}
      disabled={status === "syncing"}
      aria-label="Sync กับ Google Calendar"
      title="Sync กับ Google Calendar"
      className="flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-white/5 disabled:opacity-50"
    >
      <RefreshCw className={cn("size-4", status === "syncing" && "animate-spin")} />
    </button>
  );
}
