"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  className?: string;
}

export function TagBadge({ tag, onRemove, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-white/10",
        className
      )}
    >
      #{tag}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`ลบแท็ก ${tag}`}
          className="text-muted-foreground/60 transition-colors hover:text-foreground"
        >
          <X className="size-2.5" />
        </button>
      )}
    </span>
  );
}
