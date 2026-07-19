"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/ui-store";
import { useNoteStore } from "@/store/note-store";
import { NoteForm } from "@/features/notes/components/note-form";
import type { NoteInput } from "@/types/note";

export function CreateNoteDialog() {
  const isOpen = useUiStore((s) => s.createDialog === "note");
  const closeCreateDialog = useUiStore((s) => s.closeCreateDialog);
  const addNote = useNoteStore((s) => s.add);

  async function handleSubmit(input: NoteInput) {
    await addNote(input);
    toast.success("บันทึกโน้ตเรียบร้อยแล้ว");
    closeCreateDialog();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>โน้ตใหม่</DialogTitle>
        </DialogHeader>
        {isOpen && <NoteForm onSubmit={handleSubmit} />}
      </DialogContent>
    </Dialog>
  );
}
