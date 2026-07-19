import { createEntityStore } from "@/store/create-entity-store";
import { taskService } from "@/services/task-service";
import type { Task, TaskInput } from "@/types/task";

export const useTaskStore = createEntityStore<Task, TaskInput>(taskService);

export async function toggleTaskComplete(id: string) {
  const task = useTaskStore.getState().items.find((t) => t.id === id);
  if (!task) return;
  await useTaskStore.getState().edit(id, { completed: !task.completed });
}

export async function reorderTasks(orderedIds: string[]) {
  const reordered = await taskService.reorder(orderedIds);
  useTaskStore.getState().setItems(reordered);
}
