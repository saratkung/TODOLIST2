import { createEntityStore } from "@/store/create-entity-store";
import { noteService } from "@/services/note-service";
import type { Note, NoteInput } from "@/types/note";

export const useNoteStore = createEntityStore<Note, NoteInput>(noteService);
