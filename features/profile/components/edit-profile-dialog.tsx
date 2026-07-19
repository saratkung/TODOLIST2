"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileStore } from "@/store/profile-store";

const profileSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  phone: z.string().optional(),
  position: z.string().min(1, "กรุณากรอกตำแหน่ง"),
  department: z.string().min(1, "กรุณากรอกหน่วยงาน"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileDialog({ open, onClose }: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลส่วนตัว</DialogTitle>
        </DialogHeader>
        {open && <EditProfileForm onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function EditProfileForm({ onClose }: { onClose: () => void }) {
  const { firstName, lastName, email, phone, position, department, setProfile } = useProfileStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName, lastName, email, phone, position, department },
  });

  function submit(values: ProfileFormValues) {
    setProfile({ ...values, phone: values.phone ?? "" });
    toast.success("บันทึกข้อมูลส่วนตัวแล้ว");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">ชื่อ</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && <p className="text-xs text-danger">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">นามสกุล</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && <p className="text-xs text-danger">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">อีเมล</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
        <Input id="phone" placeholder="08x-xxx-xxxx" {...register("phone")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="position">ตำแหน่ง</Label>
          <Input id="position" {...register("position")} />
          {errors.position && <p className="text-xs text-danger">{errors.position.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="department">หน่วยงาน</Label>
          <Input id="department" {...register("department")} />
          {errors.department && <p className="text-xs text-danger">{errors.department.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full">
        บันทึก
      </Button>
    </form>
  );
}
