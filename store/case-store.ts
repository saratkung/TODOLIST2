import { createEntityStore } from "@/store/create-entity-store";
import { caseService } from "@/services/case-service";
import type { CaseFile, CaseInput } from "@/types/case";

export const useCaseStore = createEntityStore<CaseFile, CaseInput>(caseService);
