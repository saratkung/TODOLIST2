"use client";

import { useMemo, useState } from "react";
import { Trash2, NotebookPen, Pencil, Pin, PinOff, Search, Check, X } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCaseNoteStore } from "@/store/case-note-store";
import { formatThaiDate, formatThaiTime } from "@/utils/date";
import { cn } from "@/lib/utils";
import type { CaseNote } from "@/types/case";

export function CaseNotesPanel({ caseId, notes }: { caseId: string; notes: CaseNote[] }) {
  const addNote = useCaseNoteStore((s) => s.add);
  const removeNote = useCaseNoteStore((s) => s.remove);
  const editNote = useCaseNoteStore((s) => s.edit);
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q === "" ? notes : notes.filter((n) => n.content.toLowerCase().includes(q));
    return [...list].sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes, query]);

  async function handleAdd() {
    if (!content.trim()) return;
    await addNote({ caseId, content: content.trim() });
    setContent("");
  }

  function startEdit(note: CaseNote) {
    setEditingId(note.id);
    setEditingDraft(note.content);
  }

  async function saveEdit(id: string) {
    if (!editingDraft.trim()) return;
    await editNote(id, { content: editingDraft.trim() });
    setEditingId(null);
  }

  async function togglePin(note: CaseNote) {
    await editNote(note.id, { pinned: !note.pinned });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="บันทึกช่วยจำเกี่ยวกับคดีนี้..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button size="sm" onClick={handleAdd} disabled={!content.trim()}>
          บันทึกโน้ต
        </Button>
      </div>

      {notes.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหาโน้ต"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={notes.length === 0 ? "ยังไม่มีโน้ตสำหรับคดีนี้" : "ไม่พบโน้ตที่ค้นหา"}
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((note) => {
            const isEditing = editingId === note.id;
            return (
              <Card key={note.id} size="sm" className={cn(note.pinned && "ring-primary/30")}>
                <CardContent className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        rows={3}
                        value={editingDraft}
                        onChange={(e) => setEditingDraft(e.target.value)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="icon-sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="size-3.5" />
                        </Button>
                        <Button size="icon-sm" onClick={() => saveEdit(note.id)}>
                          <Check className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {formatThaiDate(note.createdAt)} · {formatThaiTime(note.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => togglePin(note)}
                          className={cn(
                            "text-muted-foreground/40 hover:text-primary",
                            note.pinned && "text-primary"
                          )}
                          aria-label={note.pinned ? "เลิกปักหมุด" : "ปักหมุดโน้ต"}
                        >
                          {note.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                        </button>
                        <button
                          onClick={() => startEdit(note)}
                          className="text-muted-foreground/40 hover:text-foreground"
                          aria-label="แก้ไขโน้ต"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => removeNote(note.id)}
                          className="text-muted-foreground/40 hover:text-danger"
                          aria-label="ลบโน้ต"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
