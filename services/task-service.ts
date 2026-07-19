import { createLocalRepository } from "@/lib/local-repository";
import type { Task, TaskInput } from "@/types/task";

const repo = createLocalRepository<Task>("investigator:tasks");

export const taskService = {
  list: repo.list,
  seedIfEmpty: repo.seedIfEmpty,
  update: repo.update,
  remove: repo.remove,

  async create(input: TaskInput): Promise<Task> {
    const items = await repo.list();
    return repo.create({ ...input, completed: false, order: items.length });
  },

  async reorder(orderedIds: string[]): Promise<Task[]> {
    const items = await repo.list();
    const byId = new Map(items.map((t) => [t.id, t]));
    const reordered = orderedIds
      .map((id, index) => {
        const task = byId.get(id);
        if (!task) return null;
        return { ...task, order: index };
      })
      .filter((t): t is Task => t !== null);
    const untouched = items.filter((t) => !orderedIds.includes(t.id));
    return repo.replaceAll([...reordered, ...untouched]);
  },
};
