"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AvatarCropDialog } from "@/features/profile/components/avatar-crop-dialog";
import { useProfileStore } from "@/store/profile-store";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface AvatarUploaderProps {
  open: boolean;
  onClose: () => void;
}

export function AvatarUploader({ open, onClose }: AvatarUploaderProps) {
  const avatarUrl = useProfileStore((s) => s.avatarUrl);
  const setAvatar = useProfileStore((s) => s.setAvatar);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("รองรับเฉพาะไฟล์ JPG, PNG หรือ WEBP");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage(reader.result as string);
      onClose();
    };
    reader.onerror = () => toast.error("ไม่สามารถอ่านไฟล์ได้");
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setAvatar(null);
    toast.success("ลบรูปโปรไฟล์แล้ว");
    onClose();
  }

  return (
    <>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="user"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="bottom" className="rounded-t-[24px]">
          <SheetHeader>
            <SheetTitle>เปลี่ยนรูปโปรไฟล์</SheetTitle>
          </SheetHeader>
          <div className="space-y-1 px-4 pb-6">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/5"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Camera className="size-4" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium">ถ่ายรูป</span>
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/5"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <ImageIcon className="size-4" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium">เลือกจาก Gallery</span>
            </button>
            {avatarUrl && (
              <button
                onClick={handleRemove}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-danger/10"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-danger/10 text-danger">
                  <Trash2 className="size-4" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-danger">ลบรูป</span>
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AvatarCropDialog
        imageSrc={pendingImage}
        onClose={() => setPendingImage(null)}
        onConfirm={(dataUrl) => {
          setAvatar(dataUrl);
          setPendingImage(null);
          toast.success("อัปเดตรูปโปรไฟล์แล้ว");
        }}
      />
    </>
  );
}
