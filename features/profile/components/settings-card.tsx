"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Moon,
  Bell,
  RefreshCw,
  DatabaseBackup,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profile-store";

interface SettingRow {
  icon: typeof Moon;
  label: string;
  description: string;
  comingSoon?: boolean;
  control?: React.ReactNode;
}

export function SettingsCard() {
  const notificationsEnabled = useProfileStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useProfileStore((s) => s.setNotificationsEnabled);
  const [resetOpen, setResetOpen] = useState(false);

  const rows: SettingRow[] = [
    {
      icon: Bell,
      label: "การแจ้งเตือน",
      description: "แจ้งเตือนงานและนัดหมายที่ใกล้ถึงกำหนด",
      control: (
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={(v) => {
            setNotificationsEnabled(v);
            toast.success(v ? "เปิดการแจ้งเตือนแล้ว" : "ปิดการแจ้งเตือนแล้ว");
          }}
        />
      ),
    },
    {
      icon: Moon,
      label: "Theme",
      description: "แอปนี้ออกแบบมาสำหรับธีมมืดโดยเฉพาะ",
      control: <Switch checked disabled />,
    },
    {
      icon: RefreshCw,
      label: "ซิงค์ข้อมูล",
      description: "เชื่อมต่อ Supabase สำหรับหลายอุปกรณ์",
      comingSoon: true,
    },
    {
      icon: DatabaseBackup,
      label: "สำรองข้อมูลอัตโนมัติ",
      description: "สำรองข้อมูลขึ้นระบบคลาวด์",
      comingSoon: true,
    },
    {
      icon: Download,
      label: "Export ข้อมูล",
      description: "ส่งออกเป็น PDF / Excel / CSV",
      comingSoon: true,
    },
    {
      icon: Upload,
      label: "Import ข้อมูล",
      description: "นำเข้าข้อมูลจากไฟล์สำรอง",
      comingSoon: true,
    },
  ];

  function handleResetData() {
    window.localStorage.clear();
    setResetOpen(false);
    toast.success("ล้างข้อมูลเรียบร้อยแล้ว กำลังโหลดใหม่...");
    setTimeout(() => window.location.reload(), 600);
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="divide-y divide-white/[0.05] p-0">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
                <row.icon className="size-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{row.label}</p>
                  {row.comingSoon && (
                    <Badge className="border-0 bg-white/10 text-[10px] text-muted-foreground">
                      เร็วๆ นี้
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{row.description}</p>
              </div>
              {row.control}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <button
            onClick={() => setResetOpen(true)}
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
              <Trash2 className="size-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-danger">ล้างข้อมูลทั้งหมด</p>
              <p className="text-xs text-muted-foreground">ลบข้อมูลในเครื่องทั้งหมดและเริ่มต้นใหม่</p>
            </div>
          </button>
        </CardContent>
      </Card>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>ล้างข้อมูลทั้งหมด?</DialogTitle>
          </DialogHeader>
          <p className="px-1 text-sm text-muted-foreground">
            การดำเนินการนี้จะลบคดี งาน นัดหมาย และโน้ตทั้งหมดในเครื่องนี้ ไม่สามารถย้อนกลับได้
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              ล้างข้อมูล
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
