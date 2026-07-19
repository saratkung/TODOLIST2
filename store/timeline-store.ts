import { createEntityStore } from "@/store/create-entity-store";
import { caseService } from "@/services/case-service";
import type { TimelineEvent, TimelineEventInput } from "@/types/case";

export const useTimelineStore = createEntityStore<TimelineEvent, TimelineEventInput>(
  caseService.timeline
);
