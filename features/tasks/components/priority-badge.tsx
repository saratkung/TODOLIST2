import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRIORITY_META } from "@/constants/task";
import type { Priority } from "@/types/common";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <Badge className={cn("border-0", PRIORITY_META[priority].badgeClass, className)}>
      {PRIORITY_META[priority].label}
    </Badge>
  );
}
