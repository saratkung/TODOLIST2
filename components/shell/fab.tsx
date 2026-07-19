"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, CheckSquare, FolderClosed, NotebookPen, CalendarClock, X } from "lucide-react";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { key: "task" as const, label: "งาน", icon: CheckSquare },
  { key: "event" as const, label: "นัดหมาย", icon: CalendarClock },
  { key: "case" as const, label: "คดี", icon: FolderClosed },
  { key: "note" as const, label: "โน้ต", icon: NotebookPen },
];

export function Fab() {
  const [open, setOpen] = useState(false);
  const openCreateDialog = useUiStore((s) => s.openCreateDialog);

  return (
    <div className="fixed right-4 z-50 flex flex-col items-end gap-3" style={{ bottom: "calc(env(safe-area-inset-bottom) + 88px)" }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-end gap-3"
          >
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.key}
                  initial={{ opacity: 0, y: 12, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.85 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    setOpen(false);
                    openCreateDialog(action.key);
                  }}
                  className="glass flex items-center gap-3 rounded-full py-2 pl-4 pr-2 shadow-lg ring-1 ring-white/[0.06]"
                >
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-6px_rgba(37,99,235,0.6)]"
        )}
        aria-label="สร้างใหม่"
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          {open ? <X className="size-6" /> : <Plus className="size-6" />}
        </motion.span>
      </motion.button>
    </div>
  );
}
