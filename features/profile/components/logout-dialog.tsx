"use client";

import { toast } from "sonner";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LogoutDialog({ open, onClose }: LogoutDialogProps) {
  function handleConfirm() {
    onClose();
    // This app doesn't have a real account/session system yet — everything
    // lives in this browser's localStorage under a single local owner.
    // Logging out for real would need auth wired up first, so this is
    // honest about that rather than pretending to end a session.
    toast.info("แอปนี้ยังไม่มีระบบบัญชีผู้ใช้จริง ข้อมูลของคุณยังอยู่ในเครื่องนี้ตามเดิม");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>ออกจากระบบ?</DialogTitle>
        </DialogHeader>
        <p className="px-1 text-sm text-muted-foreground">
          คุณต้องการออกจากระบบใช่หรือไม่
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            <LogOut className="size-4" /> ออกจากระบบ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
