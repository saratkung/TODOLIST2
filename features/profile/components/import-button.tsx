"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  validateBackupPayload,
  restoreBackup,
  countBackupItems,
  type BackupPayload,
} from "@/services/backup-service";
import { formatThaiDate, formatThaiTime } from "@/utils/date";

type Step = "idle" | "confirming" | "importing" | "done";

export function ImportButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const [pending, setPending] = useState<BackupPayload | null>(null);
  const [progress, setProgress] = useState(0);

  function reset() {
    setStep("idle");
    setPending(null);
    setProgress(0);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error("กรุณาเลือกไฟล์ .json เท่านั้น");
      return;
    }

    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      if (!validateBackupPayload(raw)) {
        toast.error("ไฟล์นี้ไม่ใช่ไฟล์สำรองข้อมูลของ Investigator หรือโครงสร้างข้อมูลไม่ถูกต้อง");
        return;
      }
      setPending(raw);
      setStep("confirming");
    } catch {
      toast.error("ไม่สามารถอ่านไฟล์นี้ได้ กรุณาตรวจสอบว่าเป็นไฟล์ JSON ที่ถูกต้อง");
    }
  }

  async function handleConfirm() {
    if (!pending) return;
    setStep("importing");
    setProgress(15);
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setProgress(45);
      await restoreBackup(pending);
      setProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 150));
      setProgress(100);
      setStep("done");
      toast.success("นำเข้าข้อมูลสำเร็จแล้ว");
      setTimeout(reset, 900);
    } catch {
      toast.error("นำเข้าข้อมูลไม่สำเร็จ ข้อมูลเดิมของคุณยังปลอดภัย");
      reset();
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <Button variant="outline" className="w-full" onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" /> Import Backup
      </Button>

      <Dialog open={step !== "idle"} onOpenChange={(open) => !open && step === "confirming" && reset()}>
        <DialogContent className="sm:max-w-sm" showCloseButton={step === "confirming"}>
          {step === "confirming" && pending && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TriangleAlert className="size-4 text-warning" /> ยืนยันการนำเข้าข้อมูล
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2 px-1 text-sm text-muted-foreground">
                <p>
                  พบข้อมูลสำรอง {countBackupItems(pending)} รายการ ส่งออกเมื่อ{" "}
                  {formatThaiDate(pending.exportedAt)} เวลา {formatThaiTime(pending.exportedAt)}
                </p>
                <p className="text-danger">
                  การนำเข้าจะแทนที่ข้อมูลปัจจุบันทั้งหมดในเครื่องนี้ ไม่สามารถย้อนกลับได้
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={reset}>
                  ยกเลิก
                </Button>
                <Button variant="destructive" onClick={handleConfirm}>
                  นำเข้าและแทนที่ข้อมูล
                </Button>
              </DialogFooter>
            </>
          )}

          {(step === "importing" || step === "done") && (
            <>
              <DialogHeader>
                <DialogTitle>{step === "done" ? "นำเข้าสำเร็จแล้ว" : "กำลังนำเข้าข้อมูล..."}</DialogTitle>
              </DialogHeader>
              <Progress value={progress} />
              <p className="text-center text-xs text-muted-foreground">{progress}%</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
