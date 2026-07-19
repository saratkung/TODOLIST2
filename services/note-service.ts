import { createLocalRepository } from "@/lib/local-repository";
import type { Note, NoteInput } from "@/types/note";

const repo = createLocalRepository<Note>("investigator:notes");

export const noteService = {
  list: repo.list,
  seedIfEmpty: repo.seedIfEmpty,
  update: repo.update,
  remove: repo.remove,

  async create(input: NoteInput): Promise<Note> {
    return repo.create({ ...input, pinned: false, favorite: false });
  },
};
