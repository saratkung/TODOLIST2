"use client";

import { useState } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogoutDialog } from "@/features/profile/components/logout-dialog";

export function AccountCard() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <Card>
      <CardContent className="divide-y divide-white/[0.05] p-0">
        <button
          onClick={() => setPasswordOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
            <KeyRound className="size-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">เปลี่ยนรหัสผ่าน</p>
            <p className="text-xs text-muted-foreground">จัดการรหัสผ่านบัญชีของคุณ</p>
          </div>
        </button>

        <button
          onClick={() => setLogoutOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
            <LogOut className="size-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-danger">ออกจากระบบ</p>
            <p className="text-xs text-muted-foreground">ออกจากบัญชีที่ใช้งานอยู่</p>
          </div>
        </button>
      </CardContent>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
          </DialogHeader>
          <p className="px-1 text-sm text-muted-foreground">
            แอปนี้ยังไม่มีระบบยืนยันตัวตน (Authentication) จึงยังไม่รองรับการเปลี่ยนรหัสผ่านในเวอร์ชันนี้
          </p>
        </DialogContent>
      </Dialog>

      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </Card>
  );
}
