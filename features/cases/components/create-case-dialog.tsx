"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUiStore } from "@/store/ui-store";
import { useCaseStore } from "@/store/case-store";
import { useChecklistStore } from "@/store/checklist-store";
import { CaseForm } from "@/features/cases/components/case-form";
import { DEFAULT_CHECKLIST_ITEMS } from "@/constants/case";
import type { CaseInput } from "@/types/case";

export function CreateCaseDialog() {
  const isOpen = useUiStore((s) => s.createDialog === "case");
  const closeCreateDialog = useUiStore((s) => s.closeCreateDialog);
  const addCase = useCaseStore((s) => s.add);
  const addChecklistItem = useChecklistStore((s) => s.add);

  async function handleSubmit(input: CaseInput) {
    const created = await addCase(input);
    for (const title of DEFAULT_CHECKLIST_ITEMS) {
      await addChecklistItem({ caseId: created.id, parentId: null, title });
    }
    toast.success("สร้างคดีใหม่เรียบร้อยแล้ว");
    closeCreateDialog();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>สร้างคดีใหม่</DialogTitle>
        </DialogHeader>
        {isOpen && <CaseForm onSubmit={handleSubmit} />}
      </DialogContent>
    </Dialog>
  );
}
