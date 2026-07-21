"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildBackupPayload, downloadBackup } from "@/services/backup-service";

export function ExportButton() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const payload = buildBackupPayload();
      downloadBackup(payload);
      toast.success("ดาวน์โหลดไฟล์สำรองข้อมูลแล้ว");
    } catch {
      toast.error("ไม่สามารถสร้างไฟล์สำรองข้อมูลได้");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleExport} disabled={exporting}>
      <Download className="size-4" /> Export Backup
    </Button>
  );
}
