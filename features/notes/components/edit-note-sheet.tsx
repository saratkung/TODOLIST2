"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Eye, Pencil } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NoteForm } from "@/features/notes/components/note-form";
import { useNoteStore } from "@/store/note-store";
import { renderMarkdownLite } from "@/utils/markdown";
import type { Note, NoteInput } from "@/types/note";

interface EditNoteSheetProps {
  note: Note | null;
  onClose: () => void;
}

export function EditNoteSheet({ note, onClose }: EditNoteSheetProps) {
  const [preview, setPreview] = useState(false);
  const editNote = useNoteStore((s) => s.edit);
  const removeNote = useNoteStore((s) => s.remove);

  if (!note) return null;

  async function handleSubmit(input: NoteInput) {
    if (!note) return;
    await editNote(note.id, input);
    toast.success("บันทึกโน้ตแล้ว");
    onClose();
  }

  async function handleDelete() {
    if (!note) return;
    await removeNote(note.id);
    toast.success("ลบโน้ตแล้ว");
    onClose();
  }

  return (
    <Sheet open={!!note} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[24px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>แก้ไขโน้ต</SheetTitle>
            <Button variant="ghost" size="sm" onClick={() => setPreview((v) => !v)}>
              {preview ? <Pencil className="size-4" /> : <Eye className="size-4" />}
              {preview ? "แก้ไข" : "ดูตัวอย่าง"}
            </Button>
          </div>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          {preview ? (
            <div className="min-h-40 rounded-2xl bg-white/[0.03] p-4 text-sm">
              {renderMarkdownLite(note.content)}
            </div>
          ) : (
            <NoteForm
              submitLabel="บันทึกการเปลี่ยนแปลง"
              defaultValues={{ title: note.title, content: note.content }}
              onSubmit={handleSubmit}
            />
          )}
          <Button variant="destructive" className="w-full" onClick={handleDelete}>
            <Trash2 className="size-4" /> ลบโน้ตนี้
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
