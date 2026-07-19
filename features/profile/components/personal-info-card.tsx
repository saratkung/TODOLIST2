"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { EditProfileDialog } from "@/features/profile/components/edit-profile-dialog";
import { useProfileStore } from "@/store/profile-store";
import { formatThaiDate } from "@/utils/date";

export function PersonalInfoCard() {
  const { firstName, lastName, email, phone, position, department, memberSince } = useProfileStore();
  const [editOpen, setEditOpen] = useState(false);

  const fields = [
    { label: "ชื่อ", value: firstName },
    { label: "นามสกุล", value: lastName },
    { label: "อีเมล", value: email },
    { label: "เบอร์โทรศัพท์", value: phone || "ยังไม่ได้ระบุ" },
    { label: "ตำแหน่ง", value: position },
    { label: "หน่วยงาน", value: department },
    { label: "วันที่สมัครใช้งาน", value: formatThaiDate(memberSince) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลส่วนตัว</CardTitle>
        <CardAction>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1 text-xs font-medium text-primary"
          >
            <Pencil className="size-3.5" /> แก้ไข
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="space-y-0.5">
            <p className="text-[11px] text-muted-foreground">{field.label}</p>
            <p className="truncate text-sm">{field.value}</p>
          </div>
        ))}
      </CardContent>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
    </Card>
  );
}
