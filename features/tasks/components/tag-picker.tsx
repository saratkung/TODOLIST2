"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/features/tasks/components/tag-badge";
import { PRESET_TASK_TAGS } from "@/constants/task";
import { cn } from "@/lib/utils";

interface TagPickerProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagPicker({ value, onChange }: TagPickerProps) {
  const [draft, setDraft] = useState("");

  function toggleTag(tag: string) {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  }

  function addCustomTag() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  const customTags = value.filter((t) => !PRESET_TASK_TAGS.includes(t));

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-1.5">
        {PRESET_TASK_TAGS.map((tag) => {
          const active = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors",
                active
                  ? "bg-primary/15 text-primary ring-primary/30"
                  : "bg-white/5 text-muted-foreground ring-white/10 hover:bg-white/10"
              )}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {customTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {customTags.map((tag) => (
            <TagBadge key={tag} tag={tag} onRemove={() => onChange(value.filter((t) => t !== tag))} />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomTag();
            }
          }}
          placeholder="เพิ่มแท็กใหม่"
          className="flex-1"
        />
        <Button type="button" variant="secondary" size="icon" aria-label="เพิ่มแท็ก" onClick={addCustomTag}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
