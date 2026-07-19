"use client";

import { useRef, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileAudio,
  FileVideo,
  FileImage,
  File as FileIcon,
  Link as LinkIcon,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAttachmentStore } from "@/store/attachment-store";
import { formatThaiDate } from "@/utils/date";
import type { Attachment } from "@/types/case";

const KIND_ICON: Record<Attachment["kind"], typeof FileIcon> = {
  pdf: FileText,
  word: FileText,
  excel: FileSpreadsheet,
  image: FileImage,
  audio: FileAudio,
  video: FileVideo,
  link: LinkIcon,
  other: FileIcon,
};

function detectKind(mimeType: string): Attachment["kind"] {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.includes("word")) return "word";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "excel";
  return "other";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CaseAttachmentsPanel({
  caseId,
  attachments,
}: {
  caseId: string;
  attachments: Attachment[];
}) {
  const addAttachment = useAttachmentStore((s) => s.add);
  const removeAttachment = useAttachmentStore((s) => s.remove);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Attachment | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      addAttachment({
        caseId,
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        url,
        kind: detectKind(file.type),
      });
    });
  }

  function openAttachment(att: Attachment) {
    if (att.kind === "image") {
      setPreview(att);
    } else {
      window.open(att.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center gap-2 rounded-[20px] border border-dashed border-white/15 py-8 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <Upload className="size-6 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-sm">แตะเพื่อแนบไฟล์</p>
        <p className="text-xs text-muted-foreground">PDF, Word, Excel, รูปภาพ, เสียง, วิดีโอ</p>
      </button>

      {attachments.length === 0 ? (
        <EmptyState icon={FileIcon} title="ยังไม่มีเอกสารแนบ" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {attachments.map((att) => {
            const Icon = KIND_ICON[att.kind];
            return (
              <div
                key={att.id}
                className="group relative overflow-hidden rounded-[16px] bg-card ring-1 ring-white/[0.06]"
              >
                <button
                  onClick={() => openAttachment(att)}
                  className="block w-full text-left transition-transform active:scale-[0.98]"
                >
                  {att.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={att.url} alt={att.name} className="h-24 w-full object-cover" />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center bg-white/[0.03]">
                      <Icon className="size-8 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{att.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatBytes(att.size)} · {formatThaiDate(att.createdAt)}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => removeAttachment(att.id)}
                  aria-label="ลบไฟล์แนบ"
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="size-3.5 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-lg overflow-hidden p-0" showCloseButton={false}>
          {preview && (
            <div className="relative">
              <button
                onClick={() => setPreview(null)}
                aria-label="ปิด"
                className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white"
              >
                <X className="size-4" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.name} className="max-h-[80vh] w-full object-contain" />
              <div className="p-3">
                <p className="truncate text-sm font-medium">{preview.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(preview.size)} · {formatThaiDate(preview.createdAt)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
