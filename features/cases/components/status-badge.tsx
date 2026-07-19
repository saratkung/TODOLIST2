import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CASE_STATUS_META } from "@/constants/case";
import type { CaseStatus } from "@/types/case";

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn("border-0", CASE_STATUS_META[status].badgeClass, className)}>
      {CASE_STATUS_META[status].label}
    </Badge>
  );
}
