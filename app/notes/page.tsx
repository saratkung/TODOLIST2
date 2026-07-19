"use client";

import { useMemo, useState } from "react";
import { Search, Plus, NotebookPen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/features/notes/components/note-card";
import { EditNoteSheet } from "@/features/notes/components/edit-note-sheet";
import { useNoteStore } from "@/store/note-store";
import { useUiStore } from "@/store/ui-store";
import type { Note } from "@/types/note";

export default function NotesPage() {
  const notes = useNoteStore((s) => s.items);
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Note | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return notes.filter(
      (n) => q === "" || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const pinned = filtered
    .filter((n) => n.pinned)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const others = filtered
    .filter((n) => !n.pinned)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notes"
        description="โน้ตและบันทึกช่วยจำ"
        action={
          <Button size="icon" onClick={() => openCreateDialog("note")} aria-label="สร้างโน้ตใหม่">
            <Plus className="size-4" />
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาโน้ต"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={NotebookPen} title="ยังไม่มีโน้ต" />
      ) : (
        <div className="space-y-5">
          {pinned.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground">ปักหมุด</p>
              <div className="space-y-2.5">
                {pinned.map((note) => (
                  <NoteCard key={note.id} note={note} onClick={() => setEditing(note)} />
                ))}
              </div>
            </div>
          )}
          {others.length > 0 && (
            <div className="space-y-2.5">
              {pinned.length > 0 && (
                <p className="text-xs font-semibold text-muted-foreground">อื่นๆ</p>
              )}
              <div className="space-y-2.5">
                {others.map((note) => (
                  <NoteCard key={note.id} note={note} onClick={() => setEditing(note)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <EditNoteSheet note={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
