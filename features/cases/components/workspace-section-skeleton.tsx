export function WorkspaceSectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-[52px] animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}
