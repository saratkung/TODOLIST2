import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
}

const TONE_CLASS: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "bg-white/10 text-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

export function StatTile({ icon: Icon, label, value, tone = "default" }: StatTileProps) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            TONE_CLASS[tone]
          )}
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
