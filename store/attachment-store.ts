import { createEntityStore } from "@/store/create-entity-store";
import { caseService } from "@/services/case-service";
import type { Attachment, AttachmentInput } from "@/types/case";

export const useAttachmentStore = createEntityStore<Attachment, AttachmentInput>(
  caseService.attachments
);
