"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge } from "@/features/calendar/components/sync-status-badge";
import { ConnectGoogleButton } from "@/features/profile/components/connect-google-button";
import { useGoogleCalendarStore } from "@/store/google-calendar-store";
import { useGoogleSyncNow } from "@/features/calendar/hooks/use-google-sync-now";
import { formatThaiDate, formatThaiTime } from "@/utils/date";
import { cn } from "@/lib/utils";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  not_configured: "ยังไม่ได้ตั้งค่า Google OAuth client บนเซิร์ฟเวอร์",
  access_denied: "คุณยกเลิกการอนุญาตที่ฝั่ง Google",
  invalid_callback: "ข้อมูลตอบกลับจาก Google ไม่ถูกต้อง",
  state_mismatch: "ตรวจสอบความปลอดภัยไม่ผ่าน กรุณาลองใหม่",
  no_refresh_token: "Google ไม่ได้ส่ง refresh token กลับมา กรุณาลองเชื่อมต่อใหม่",
  token_exchange_failed: "แลกเปลี่ยน token กับ Google ไม่สำเร็จ",
};

export function GoogleCalendarCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = useGoogleCalendarStore((s) => s.status);
  const googleEmail = useGoogleCalendarStore((s) => s.googleEmail);
  const lastSync = useGoogleCalendarStore((s) => s.lastSync);
  const checkStatus = useGoogleCalendarStore((s) => s.checkStatus);
  const setDisconnected = useGoogleCalendarStore((s) => s.setDisconnected);
  const { syncNow } = useGoogleSyncNow();
  const isConnected = status === "connected" || status === "syncing";

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const connected = searchParams.get("gcal_connected");
    const error = searchParams.get("gcal_error");
    if (connected) {
      toast.success("เชื่อมต่อ Google Calendar สำเร็จ");
      checkStatus();
      router.replace("/profile/google-calendar");
    } else if (error) {
      toast.error(OAUTH_ERROR_MESSAGES[error] ?? "เชื่อมต่อ Google Calendar ไม่สำเร็จ");
      router.replace("/profile/google-calendar");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleDisconnect() {
    await fetch("/api/auth/google/disconnect", { method: "POST" });
    setDisconnected();
    toast.success("ยกเลิกการเชื่อมต่อ Google Calendar แล้ว");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <SyncStatusBadge />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground">บัญชี Google</p>
              <p className="truncate">{googleEmail ?? "ยังไม่ได้เชื่อมต่อ"}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground">ซิงก์ล่าสุด</p>
              <p className="truncate">
                {lastSync ? `${formatThaiDate(lastSync)} ${formatThaiTime(lastSync)}` : "ยังไม่เคยซิงก์"}
              </p>
            </div>
          </div>

          {isConnected ? (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={syncNow} disabled={status === "syncing"}>
                <RefreshCw className={cn("size-4", status === "syncing" && "animate-spin")} /> Sync Now
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <ConnectGoogleButton />
          )}
        </CardContent>
      </Card>

      {!isConnected && (
        <p className="px-1 text-xs text-muted-foreground">
          ฟีเจอร์ Sync ยังอยู่ระหว่างพัฒนา — เชื่อมต่อบัญชี Google ก่อนเพื่อใช้งาน Sync Now
        </p>
      )}
    </div>
  );
}
