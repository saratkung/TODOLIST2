"use client";

import { useState } from "react";
import { Camera, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "@/features/profile/components/avatar-uploader";
import { EditProfileDialog } from "@/features/profile/components/edit-profile-dialog";
import { useProfileStore } from "@/store/profile-store";

export function ProfileHeader() {
  const name = useProfileStore((s) => s.name);
  const rank = useProfileStore((s) => s.rank);
  const email = useProfileStore((s) => s.email);
  const position = useProfileStore((s) => s.position);
  const department = useProfileStore((s) => s.department);
  const avatarUrl = useProfileStore((s) => s.avatarUrl);
  const [avatarSheetOpen, setAvatarSheetOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const initials = name.trim().slice(0, 1) || "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center gap-3 rounded-[20px] bg-card p-6 text-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06]"
    >
      <button
        onClick={() => setAvatarSheetOpen(true)}
        aria-label="เปลี่ยนรูปโปรไฟล์"
        className="group relative"
      >
        <Avatar className="size-24 ring-2 ring-white/10">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="bg-primary/15 text-3xl font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-card transition-transform group-active:scale-90">
          <Camera className="size-4" strokeWidth={2} />
        </span>
      </button>

      <div className="space-y-0.5">
        <p className="text-lg font-semibold">
          {rank} {name}
        </p>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-xs text-muted-foreground">
          {position} · {department}
        </p>
      </div>

      <div className="flex w-full gap-2 pt-2">
        <Button variant="outline" className="flex-1" size="sm" onClick={() => setAvatarSheetOpen(true)}>
          <Camera className="size-3.5" /> เปลี่ยนรูปโปรไฟล์
        </Button>
        <Button className="flex-1" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="size-3.5" /> แก้ไขข้อมูล
        </Button>
      </div>

      <AvatarUploader open={avatarSheetOpen} onClose={() => setAvatarSheetOpen(false)} />
      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
    </motion.div>
  );
}
