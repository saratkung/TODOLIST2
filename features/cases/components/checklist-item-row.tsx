"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, ChevronDown, Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChecklistStore, toggleChecklistItem } from "@/store/checklist-store";
import type { ChecklistItem } from "@/types/case";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  childItems: ChecklistItem[];
  caseId: string;
}

export function ChecklistItemRow({ item, childItems, caseId }: ChecklistItemRowProps) {
  const [expanded, setExpanded] = useState(true);
  const [addingChild, setAddingChild] = useState(false);
  const [childTitle, setChildTitle] = useState("");
  const addItem = useChecklistStore((s) => s.add);
  const removeItem = useChecklistStore((s) => s.remove);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const doneChildren = childItems.filter((c) => c.completed).length;

  function submitChild() {
    if (!childTitle.trim()) {
      setAddingChild(false);
      return;
    }
    addItem({ caseId, parentId: item.id, title: childTitle.trim() });
    setChildTitle("");
    setAddingChild(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="rounded-2xl"
    >
      <div className="group flex items-center gap-2 rounded-2xl px-1 py-2 hover:bg-white/[0.03]">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground/40 active:cursor-grabbing"
          aria-label="ลากเพื่อจัดเรียง"
        >
          <GripVertical className="size-4" />
        </button>

        <button
          onClick={() => toggleChecklistItem(item.id)}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            item.completed
              ? "border-success bg-success text-white"
              : "border-white/20 text-transparent hover:border-primary"
          )}
        >
          <motion.span
            initial={false}
            animate={{ scale: item.completed ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <Check className="size-3" strokeWidth={3} />
          </motion.span>
        </button>

        <p
          className={cn(
            "flex-1 text-sm",
            item.completed && "text-muted-foreground line-through"
          )}
        >
          {item.title}
        </p>

        {childItems.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            {doneChildren}/{childItems.length}
          </span>
        )}

        <button
          onClick={() => setAddingChild((v) => !v)}
          className="text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="เพิ่มรายการย่อย"
        >
          <Plus className="size-4" />
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="text-muted-foreground/50 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
          aria-label="ลบรายการ"
        >
          <Trash2 className="size-4" />
        </button>
        {childItems.length > 0 && (
          <button onClick={() => setExpanded((v) => !v)} aria-label="ย่อ/ขยาย">
            <motion.span animate={{ rotate: expanded ? 0 : -90 }} className="block text-muted-foreground">
              <ChevronDown className="size-4" />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && childItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-9 overflow-hidden border-l border-white/10 pl-3"
          >
            {childItems.map((child) => (
              <div key={child.id} className="flex items-center gap-2 py-1.5">
                <button
                  onClick={() => toggleChecklistItem(child.id)}
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                    child.completed
                      ? "border-success bg-success text-white"
                      : "border-white/20 text-transparent hover:border-primary"
                  )}
                >
                  <Check className="size-2.5" strokeWidth={3} />
                </button>
                <p
                  className={cn(
                    "flex-1 text-[13px]",
                    child.completed && "text-muted-foreground line-through"
                  )}
                >
                  {child.title}
                </p>
                <button
                  onClick={() => removeItem(child.id)}
                  className="text-muted-foreground/40 hover:text-danger"
                  aria-label="ลบรายการย่อย"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {addingChild && (
        <div className="ml-9 flex items-center gap-2 pl-3 pb-2">
          <input
            autoFocus
            value={childTitle}
            onChange={(e) => setChildTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitChild()}
            onBlur={submitChild}
            placeholder="รายการย่อย..."
            className="flex-1 border-b border-white/10 bg-transparent py-1 text-[13px] outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      )}
    </div>
  );
}
