"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CONTAINER_SIZE = 260;
const OUTPUT_SIZE = 512;

interface AvatarCropDialogProps {
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (dataUrl: string) => void;
}

export function AvatarCropDialog({ imageSrc, onClose, onConfirm }: AvatarCropDialogProps) {
  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>ปรับตำแหน่งรูปโปรไฟล์</DialogTitle>
        </DialogHeader>
        {imageSrc && (
          <AvatarCropContent
            key={imageSrc}
            imageSrc={imageSrc}
            onClose={onClose}
            onConfirm={onConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AvatarCropContent({
  imageSrc,
  onClose,
  onConfirm,
}: {
  imageSrc: string;
  onClose: () => void;
  onConfirm: (dataUrl: string) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ startX: number; startY: number; startOffset: { x: number; y: number } } | null>(
    null
  );

  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const baseScale =
    naturalSize.w && naturalSize.h
      ? Math.max(CONTAINER_SIZE / naturalSize.w, CONTAINER_SIZE / naturalSize.h)
      : 1;
  const effectiveScale = baseScale * zoom;
  const displayWidth = naturalSize.w * effectiveScale;
  const displayHeight = naturalSize.h * effectiveScale;

  function clamp(value: number, max: number) {
    return Math.max(-max, Math.min(max, value));
  }

  function clampOffset(next: { x: number; y: number }) {
    const maxX = Math.max(0, (displayWidth - CONTAINER_SIZE) / 2);
    const maxY = Math.max(0, (displayHeight - CONTAINER_SIZE) / 2);
    return { x: clamp(next.x, maxX), y: clamp(next.y, maxY) };
  }

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, startOffset: offset };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset(
      clampOffset({ x: dragState.current.startOffset.x + dx, y: dragState.current.startOffset.y + dy })
    );
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleZoomChange(value: number) {
    setZoom(value);
    setOffset((prev) => clampOffset(prev));
  }

  async function handleConfirm() {
    const img = imgRef.current;
    if (!img) return;
    setUploading(true);
    setProgress(0);

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setUploading(false);
      toast.error("ไม่สามารถประมวลผลรูปภาพได้");
      return;
    }

    const scaleRatio = OUTPUT_SIZE / CONTAINER_SIZE;
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const dw = displayWidth * scaleRatio;
    const dh = displayHeight * scaleRatio;
    const dx = (CONTAINER_SIZE / 2 - displayWidth / 2 + offset.x) * scaleRatio;
    const dy = (CONTAINER_SIZE / 2 - displayHeight / 2 + offset.y) * scaleRatio;
    ctx.drawImage(img, dx, dy, dw, dh);

    // Simulated upload — no Supabase Storage project is connected yet (see
    // supabase/migrations/0005_profile.sql). This animates the same UX a real
    // upload would show; swap for an actual fetch/upload call once wired up.
    for (const step of [20, 45, 70, 90, 100]) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      setProgress(step);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    onConfirm(dataUrl);
    setUploading(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative touch-none overflow-hidden rounded-full bg-black ring-2 ring-primary/50"
        style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt="รูปที่จะครอป"
          onLoad={handleImageLoad}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-w-none select-none"
          style={{
            width: displayWidth || undefined,
            height: displayHeight || undefined,
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
          }}
        />
      </div>

      <div className="flex w-full items-center gap-3">
        <span className="text-xs text-muted-foreground">ซูม</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => handleZoomChange(Number(e.target.value))}
          className="flex-1 accent-primary"
          aria-label="ซูมรูปภาพ"
        />
      </div>

      {uploading && (
        <div className="w-full space-y-1">
          <Progress value={progress} />
          <p className="text-center text-xs text-muted-foreground">กำลังอัปโหลด... {progress}%</p>
        </div>
      )}

      <div className="flex w-full gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose} disabled={uploading}>
          <X className="size-4" /> ยกเลิก
        </Button>
        <Button className="flex-1" onClick={handleConfirm} disabled={uploading}>
          <Check className="size-4" /> ยืนยัน
        </Button>
      </div>
    </div>
  );
}
