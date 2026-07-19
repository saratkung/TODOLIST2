export function CaseListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((row) => (
        <div key={row} className="h-[92px] animate-pulse rounded-[20px] bg-white/[0.04]" />
      ))}
    </div>
  );
}
