import { create } from "zustand";
import type { BaseEntity } from "@/types/common";

type Patch<T> = Partial<Omit<T, keyof BaseEntity>>;

interface EntityService<T, Input> {
  list: () => Promise<T[]>;
  create: (input: Input) => Promise<T>;
  update: (id: string, patch: Patch<T>) => Promise<T | null>;
  remove: (id: string) => Promise<void>;
  seedIfEmpty?: (seed: T[]) => Promise<T[]>;
}

export interface EntityStoreState<T, Input> {
  items: T[];
  hydrated: boolean;
  hydrate: (seed?: T[]) => Promise<void>;
  add: (input: Input) => Promise<T>;
  edit: (id: string, patch: Patch<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setItems: (items: T[]) => void;
}

export function createEntityStore<T extends BaseEntity, Input>(
  service: EntityService<T, Input>
) {
  return create<EntityStoreState<T, Input>>((set, get) => ({
    items: [],
    hydrated: false,

    hydrate: async (seed) => {
      if (get().hydrated) return;
      const items = seed && service.seedIfEmpty
        ? await service.seedIfEmpty(seed)
        : await service.list();
      set({ items, hydrated: true });
    },

    add: async (input) => {
      const entity = await service.create(input);
      set({ items: [...get().items, entity] });
      return entity;
    },

    edit: async (id, patch) => {
      const updated = await service.update(id, patch);
      if (!updated) return;
      set({
        items: get().items.map((item) => (item.id === id ? updated : item)),
      });
    },

    remove: async (id) => {
      await service.remove(id);
      set({ items: get().items.filter((item) => item.id !== id) });
    },

    setItems: (items) => set({ items }),
  }));
}
