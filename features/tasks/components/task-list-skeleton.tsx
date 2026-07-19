export function TaskListSkeleton() {
  return (
    <div className="space-y-5">
      {[0, 1].map((section) => (
        <div key={section} className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />
          <div className="space-y-1.5">
            {[0, 1, 2].map((row) => (
              <div key={row} className="h-[52px] animate-pulse rounded-2xl bg-white/[0.04]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
