"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGoogleCalendarStore } from "@/store/google-calendar-store";

export function ConnectGoogleButton() {
  const [open, setOpen] = useState(false);
  const configured = useGoogleCalendarStore((s) => s.configured);

  if (configured) {
    return (
      <Button className="w-full" render={<a href="/api/auth/google/start" />}>
        Connect Google Calendar
      </Button>
    );
  }

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)} disabled={configured === null}>
        Connect Google Calendar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>ยังไม่ได้ตั้งค่า Google Calendar</DialogTitle>
          </DialogHeader>
          <p className="px-1 text-sm text-muted-foreground">
            การเชื่อมต่อ Google Calendar ต้องมี Google Cloud OAuth client และเซิร์ฟเวอร์สำหรับแลกเปลี่ยน/เก็บ
            token อย่างปลอดภัย ซึ่งยังไม่ได้ตั้งค่าไว้ในเวอร์ชันนี้
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
