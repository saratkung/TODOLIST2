"use client";

import { Pin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/store/note-store";
import { formatThaiDate } from "@/utils/date";
import type { Note } from "@/types/note";

export function NoteCard({ note, onClick }: { note: Note; onClick: () => void }) {
  const editNote = useNoteStore((s) => s.edit);

  return (
    <Card className="cursor-pointer transition-transform active:scale-[0.98]" onClick={onClick}>
      <CardContent className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{note.title}</p>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                editNote(note.id, { favorite: !note.favorite });
              }}
              aria-label="ปักหมุดโปรด"
            >
              <Star
                className={cn(
                  "size-4",
                  note.favorite ? "fill-warning text-warning" : "text-muted-foreground/50"
                )}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                editNote(note.id, { pinned: !note.pinned });
              }}
              aria-label="ปักหมุด"
            >
              <Pin
                className={cn(
                  "size-4",
                  note.pinned ? "fill-primary text-primary" : "text-muted-foreground/50"
                )}
              />
            </button>
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{note.content}</p>
        <p className="text-[10px] text-muted-foreground/70">{formatThaiDate(note.updatedAt)}</p>
      </CardContent>
    </Card>
  );
}
