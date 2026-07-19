import { ProgressRing } from "@/components/shared/progress-ring";
import type { Task } from "@/types/task";

interface ProgressCardProps {
  progress: number;
  tasks: Task[];
}

export function ProgressCard({ progress, tasks }: ProgressCardProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const remaining = total - done;

  return (
    <div className="flex items-center gap-5">
      <ProgressRing
        value={progress}
        size={72}
        strokeWidth={7}
        label={<span className="text-base font-bold">{progress}%</span>}
      />
      <div className="grid flex-1 grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold">{total}</p>
          <p className="text-[11px] text-muted-foreground">งานทั้งหมด</p>
        </div>
        <div>
          <p className="text-lg font-bold text-success">{done}</p>
          <p className="text-[11px] text-muted-foreground">เสร็จแล้ว</p>
        </div>
        <div>
          <p className="text-lg font-bold text-warning">{remaining}</p>
          <p className="text-[11px] text-muted-foreground">เหลือ</p>
        </div>
      </div>
    </div>
  );
}
