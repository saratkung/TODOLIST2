"use client";

import { useSyncStore } from "@/store/sync-store";
import { formatThaiDate, formatThaiTime } from "@/utils/date";
import { cn } from "@/lib/utils";
import type { SyncStatus as SyncStatusValue } from "@/store/sync-store";

const STATUS_META: Record<SyncStatusValue, { dot: string; label: string; className: string }> = {
  idle: { dot: "⚪", label: "ยังไม่มีการเปลี่ยนแปลง", className: "text-muted-foreground" },
  saving: { dot: "🟡", label: "กำลังบันทึก...", className: "text-warning" },
  saved: { dot: "🟢", label: "บันทึกในเครื่องนี้แล้ว", className: "text-success" },
  error: { dot: "🔴", label: "บันทึกไม่สำเร็จ", className: "text-danger" },
};

export function SyncStatus() {
  const status = useSyncStore((s) => s.status);
  const lastSavedAt = useSyncStore((s) => s.lastSavedAt);
  const errorMessage = useSyncStore((s) => s.errorMessage);
  // lastSavedAt survives a full reload but the transient `status` resets to
  // "idle" — if we know a save happened before, reflect that instead of
  // claiming "no changes yet" next to a timestamp that says otherwise.
  const displayStatus = status === "idle" && lastSavedAt ? "saved" : status;
  const meta = STATUS_META[displayStatus];

  return (
    <div className="space-y-1.5 rounded-2xl bg-white/[0.03] px-3.5 py-3">
      <div className="flex items-center gap-2">
        <span aria-hidden>{meta.dot}</span>
        <p className={cn("text-sm font-medium", meta.className)}>{meta.label}</p>
      </div>
      {lastSavedAt && (
        <p className="text-xs text-muted-foreground">
          บันทึกล่าสุด: {formatThaiDate(lastSavedAt)} เวลา {formatThaiTime(lastSavedAt)}
        </p>
      )}
      {status === "error" && errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
      <p className="text-[11px] text-muted-foreground/70">
        ข้อมูลบันทึกอัตโนมัติในเครื่องนี้ ยังไม่ได้เชื่อมต่อ Cloud Sync ระหว่างอุปกรณ์
      </p>
    </div>
  );
}
