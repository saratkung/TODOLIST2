"use client";

import { motion } from "framer-motion";
import { CaseCard } from "@/features/cases/components/case-card";
import type { CaseFile } from "@/types/case";

export function CaseList({ cases }: { cases: CaseFile[] }) {
  return (
    <div className="space-y-3">
      {cases.map((caseFile, index) => (
        <motion.div
          key={caseFile.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
        >
          <CaseCard caseFile={caseFile} />
        </motion.div>
      ))}
    </div>
  );
}
