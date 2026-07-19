"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GitCommitVertical } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimelineStore } from "@/store/timeline-store";
import { DEFAULT_TIMELINE_STAGES } from "@/constants/case";
import { formatThaiDate, formatThaiTime } from "@/utils/date";
import type { TimelineEvent } from "@/types/case";

export function CaseTimeline({ caseId, timeline }: { caseId: string; timeline: TimelineEvent[] }) {
  const addEvent = useTimelineStore((s) => s.add);
  const removeEvent = useTimelineStore((s) => s.remove);
  const [stage, setStage] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");

  const sorted = [...timeline].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const nextSuggested = DEFAULT_TIMELINE_STAGES.find(
    (s) => !sorted.some((e) => e.title === s)
  );

  async function handleAdd() {
    const title = stage === "custom" ? customTitle.trim() : stage || nextSuggested;
    if (!title) return;
    await addEvent({ caseId, title, timestamp: new Date().toISOString() });
    setStage("");
    setCustomTitle("");
  }

  return (
    <div className="space-y-5">
      {sorted.length === 0 ? (
        <EmptyState icon={GitCommitVertical} title="ยังไม่มีลำดับเหตุการณ์" />
      ) : (
        <div className="space-y-0 border-l border-white/10 pl-5">
          {sorted.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="group relative pb-6 last:pb-0"
            >
              <span className="absolute -left-[26px] top-0.5 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                <span className="size-1.5 rounded-full bg-white" />
              </span>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatThaiDate(event.timestamp)} · {formatThaiTime(event.timestamp)}
                  </p>
                  {event.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeEvent(event.id)}
                  className="text-muted-foreground/40 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                  aria-label="ลบเหตุการณ์"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="space-y-2 rounded-2xl bg-white/[0.03] p-3">
        <p className="text-xs font-medium text-muted-foreground">เพิ่มขั้นตอนถัดไป</p>
        <div className="flex gap-2">
          <Select value={stage} onValueChange={(v) => setStage(v ?? "")}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={nextSuggested ?? "เลือกขั้นตอน"}>
                {(v: string | null) => (v === "custom" ? "กำหนดเอง..." : v || nextSuggested || "เลือกขั้นตอน")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_TIMELINE_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
              <SelectItem value="custom">กำหนดเอง...</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" onClick={handleAdd} aria-label="เพิ่มขั้นตอน">
            <Plus className="size-4" />
          </Button>
        </div>
        {stage === "custom" && (
          <Input
            placeholder="ระบุชื่อขั้นตอน"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
