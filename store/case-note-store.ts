import { createEntityStore } from "@/store/create-entity-store";
import { caseService } from "@/services/case-service";
import type { CaseNote, CaseNoteInput } from "@/types/case";

export const useCaseNoteStore = createEntityStore<CaseNote, CaseNoteInput>(caseService.notes);
