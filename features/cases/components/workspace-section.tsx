"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";

interface WorkspaceSectionProps {
  title: string;
  icon: LucideIcon;
  count?: number;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function WorkspaceSection({
  title,
  icon: Icon,
  count,
  action,
  defaultOpen = true,
  children,
}: WorkspaceSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 items-center gap-2 text-left"
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <CardTitle className="min-w-0 truncate">
            {title}
            {typeof count === "number" && (
              <span className="ml-1.5 text-muted-foreground">({count})</span>
            )}
          </CardTitle>
          <motion.span
            animate={{ rotate: open ? 0 : -90 }}
            className="shrink-0 text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>
        {action && <CardAction onClick={(e) => e.stopPropagation()}>{action}</CardAction>}
      </CardHeader>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <CardContent className="pt-1">{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
