"use client";

import { useGoogleCalendarStore } from "@/store/google-calendar-store";
import { cn } from "@/lib/utils";
import type { GoogleConnectionStatus } from "@/store/google-calendar-store";

const STATUS_META: Record<GoogleConnectionStatus, { dot: string; label: string; className: string }> = {
  checking: { dot: "⚪", label: "กำลังตรวจสอบ...", className: "text-muted-foreground" },
  disconnected: { dot: "⚪", label: "ยังไม่เชื่อมต่อ", className: "text-muted-foreground" },
  connecting: { dot: "🟡", label: "กำลังเชื่อมต่อ...", className: "text-warning" },
  connected: { dot: "🟢", label: "Connected", className: "text-success" },
  syncing: { dot: "🟡", label: "Syncing...", className: "text-warning" },
  error: { dot: "🔴", label: "Error", className: "text-danger" },
};

export function SyncStatusBadge() {
  const status = useGoogleCalendarStore((s) => s.status);
  const meta = STATUS_META[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", meta.className)}>
      <span aria-hidden>{meta.dot}</span>
      {meta.label}
    </span>
  );
}
