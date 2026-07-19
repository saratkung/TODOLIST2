"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Share2, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/shared/progress-ring";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CaseForm } from "@/features/cases/components/case-form";
import { StatusBadge } from "@/features/cases/components/status-badge";
import { PriorityBadge } from "@/features/tasks/components/priority-badge";
import { useCaseStore } from "@/store/case-store";
import { formatThaiDate } from "@/utils/date";
import type { CaseFile, CaseInput } from "@/types/case";

const FIELDS: Array<{ key: keyof CaseFile; label: string }> = [
  { key: "complainant", label: "ผู้ร้อง" },
  { key: "victim", label: "ผู้เสียหาย" },
  { key: "suspect", label: "ผู้ต้องหา" },
  { key: "officer", label: "พนักงานสอบสวน" },
];

export function CaseHeader({ caseFile, progress }: { caseFile: CaseFile; progress: number }) {
  const [editing, setEditing] = useState(false);
  const editCase = useCaseStore((s) => s.edit);
  const removeCase = useCaseStore((s) => s.remove);
  const router = useRouter();

  async function handleUpdate(input: CaseInput) {
    await editCase(caseFile.id, input);
    toast.success("บันทึกการเปลี่ยนแปลงแล้ว");
    setEditing(false);
  }

  async function handleDelete() {
    await removeCase(caseFile.id);
    toast.success("ลบคดีแล้ว");
    router.push("/cases");
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: `${caseFile.caseNumber} — ${caseFile.title}`,
      text: `คดี ${caseFile.caseNumber}: ${caseFile.title}`,
      url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the native share sheet — no-op
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("คัดลอกลิงก์คดีแล้ว");
    } catch {
      toast.error("ไม่สามารถคัดลอกลิงก์ได้");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {caseFile.caseNumber} · {caseFile.category}
          </p>
          <h1 className="text-xl font-semibold tracking-tight">{caseFile.title}</h1>
          <p className="text-xs text-muted-foreground">
            สร้างเมื่อ {formatThaiDate(caseFile.createdAt)}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <StatusBadge status={caseFile.status} />
            <PriorityBadge priority={caseFile.priority} />
          </div>
        </div>
        <ProgressRing value={progress} size={56} strokeWidth={5} />
      </div>

      {caseFile.description && (
        <p className="rounded-[20px] bg-card p-4 text-sm text-muted-foreground shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06]">
          {caseFile.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 rounded-[20px] bg-card p-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06]">
        {FIELDS.map((field) => {
          const value = caseFile[field.key];
          if (!value) return null;
          return (
            <div key={field.key} className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground">{field.label}</p>
              <p className="text-sm">{String(value)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {caseFile.deadline && (
          <DeadlineChip label="ครบกำหนด" date={caseFile.deadline} />
        )}
        {caseFile.custodyDeadline && (
          <DeadlineChip label="ฝากขังถึง" date={caseFile.custodyDeadline} tone="danger" />
        )}
        {caseFile.submissionDeadline && (
          <DeadlineChip label="ส่งสำนวน" date={caseFile.submissionDeadline} tone="warning" />
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setEditing(true)}>
          <Pencil className="size-4" /> แก้ไข
        </Button>
        <Button variant="outline" size="icon" aria-label="แชร์คดี" onClick={handleShare}>
          <Share2 className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" aria-label="เมนูเพิ่มเติม">
                <MoreVertical className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4" /> ลบคดี
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={editing} onOpenChange={setEditing}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[24px]">
          <SheetHeader>
            <SheetTitle>แก้ไขคดี</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <CaseForm
              submitLabel="บันทึกการเปลี่ยนแปลง"
              defaultValues={{
                caseNumber: caseFile.caseNumber,
                title: caseFile.title,
                category: caseFile.category,
                description: caseFile.description,
                complainant: caseFile.complainant,
                victim: caseFile.victim,
                suspect: caseFile.suspect,
                officer: caseFile.officer,
                status: caseFile.status,
                priority: caseFile.priority,
                deadline: caseFile.deadline?.slice(0, 10),
                custodyDeadline: caseFile.custodyDeadline?.slice(0, 10),
                submissionDeadline: caseFile.submissionDeadline?.slice(0, 10),
              }}
              onSubmit={handleUpdate}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DeadlineChip({
  label,
  date,
  tone = "default",
}: {
  label: string;
  date: string;
  tone?: "default" | "danger" | "warning";
}) {
  const toneClass =
    tone === "danger"
      ? "bg-danger/10 text-danger"
      : tone === "warning"
        ? "bg-warning/10 text-warning"
        : "bg-white/5 text-foreground";
  return (
    <div className={`rounded-xl px-2.5 py-2 ${toneClass}`}>
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-xs font-medium">{formatThaiDate(date)}</p>
    </div>
  );
}
