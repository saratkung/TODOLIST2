export function AgendaSkeleton() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[60px] animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}
