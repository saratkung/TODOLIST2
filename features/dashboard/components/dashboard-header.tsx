"use client";

import Link from "next/link";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { greetingForNow, formatThaiDateLong, isWithinNextDays } from "@/utils/date";
import { getOverdueTasks } from "@/utils/task";
import { useProfileStore } from "@/store/profile-store";
import { useTaskStore } from "@/store/task-store";
import { useCaseStore } from "@/store/case-store";

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return null;
}

export function DashboardHeader() {
  const cachedNow = useRef<Date | null>(null);
  const getSnapshot = useCallback(() => {
    if (cachedNow.current === null) {
      cachedNow.current = new Date();
    }
    return cachedNow.current;
  }, []);
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const name = useProfileStore((s) => s.name);
  const rank = useProfileStore((s) => s.rank);
  const tasks = useTaskStore((s) => s.items);
  const cases = useCaseStore((s) => s.items);

  const overdueCount = getOverdueTasks(tasks).length;
  const custodyCount = cases.filter(
    (c) => c.custodyDeadline && isWithinNextDays(c.custodyDeadline, 2)
  ).length;
  const alertCount = overdueCount + custodyCount;

  function handleNotificationClick() {
    if (alertCount === 0) {
      toast.info("ไม่มีการแจ้งเตือนใหม่");
    } else {
      toast.warning(`มีรายการด่วน ${alertCount} รายการที่ต้องดำเนินการ`);
    }
  }

  const initials = name.trim().slice(0, 1) || "?";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 space-y-0.5">
        <h1 className="truncate text-xl font-semibold tracking-tight">
          {now ? greetingForNow() : "สวัสดี"}, {rank}
        </h1>
        <p className="text-sm text-muted-foreground">{now ? formatThaiDateLong(now) : " "}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleNotificationClick}
          aria-label="การแจ้งเตือน"
          className="relative flex size-10 items-center justify-center rounded-full bg-card ring-1 ring-white/[0.06] transition-colors hover:bg-secondary active:scale-95"
        >
          <Bell className="size-[18px]" strokeWidth={1.75} />
          {alertCount > 0 && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-background" />
          )}
        </button>

        <Link href="/profile" aria-label="โปรไฟล์">
          <Avatar className="size-10 ring-1 ring-white/[0.06] transition-transform active:scale-95">
            <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
}
