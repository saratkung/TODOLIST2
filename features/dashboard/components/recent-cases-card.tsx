"use client";

import Link from "next/link";
import { FolderClosed } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { CaseCard } from "@/features/cases/components/case-card";
import { useCaseStore } from "@/store/case-store";

export function RecentCasesCard() {
  const cases = useCaseStore((s) => s.items);
  const recent = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">คดีล่าสุด</h2>
        <Link href="/cases" className="text-xs font-medium text-primary">
          ดูทั้งหมด
        </Link>
      </div>
      {recent.length === 0 ? (
        <EmptyState icon={FolderClosed} title="ยังไม่มีคดี" />
      ) : (
        <div className="space-y-3">
          {recent.map((c) => (
            <CaseCard key={c.id} caseFile={c} />
          ))}
        </div>
      )}
    </div>
  );
}
