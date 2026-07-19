"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REMINDER_META } from "@/constants/task";
import type { ReminderOffset } from "@/types/common";

const CALENDAR_REMINDER_OPTIONS: ReminderOffset[] = ["15m", "30m", "1h", "1d"];

interface ReminderSelectorProps {
  value: ReminderOffset | undefined;
  onChange: (value: ReminderOffset | undefined) => void;
}

export function ReminderSelector({ value, onChange }: ReminderSelectorProps) {
  const enabled = value !== undefined;

  return (
    <div className="space-y-2.5 rounded-xl bg-white/5 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="reminder-toggle" className="text-sm font-normal">
          แจ้งเตือน
        </Label>
        <Switch
          id="reminder-toggle"
          checked={enabled}
          onCheckedChange={(v) => onChange(v ? "30m" : undefined)}
        />
      </div>

      {enabled && (
        <Select value={value} onValueChange={(v) => v && onChange(v as ReminderOffset)}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {(v: string) => REMINDER_META[v as ReminderOffset]?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CALENDAR_REMINDER_OPTIONS.map((key) => (
              <SelectItem key={key} value={key}>
                {REMINDER_META[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
