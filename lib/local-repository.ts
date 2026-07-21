import { generateId } from "@/lib/id";
import type { BaseEntity } from "@/types/common";

export const LOCAL_OWNER_ID = "local-user";

function readAll<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

/** Throws a normalized, user-facing error if the write fails (e.g. storage quota exceeded, private-browsing restrictions). */
function writeAll<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    throw new Error("ไม่สามารถบันทึกข้อมูลได้ พื้นที่จัดเก็บในเครื่องอาจเต็มหรือถูกจำกัดการเข้าถึง");
  }
}

/**
 * localStorage-backed CRUD repository. Async signatures mirror a real
 * network/Supabase client so the store layer above it doesn't change
 * when a real backend is wired in later.
 */
export function createLocalRepository<T extends BaseEntity>(storageKey: string) {
  return {
    async list(): Promise<T[]> {
      return readAll<T>(storageKey);
    },

    async seedIfEmpty(seed: T[]): Promise<T[]> {
      const existing = readAll<T>(storageKey);
      if (existing.length > 0) return existing;
      writeAll(storageKey, seed);
      return seed;
    },

    async create(input: Omit<T, keyof BaseEntity>): Promise<T> {
      const now = new Date().toISOString();
      const entity = {
        ...input,
        id: generateId(),
        ownerId: LOCAL_OWNER_ID,
        createdAt: now,
        updatedAt: now,
      } as T;
      const items = readAll<T>(storageKey);
      writeAll(storageKey, [...items, entity]);
      return entity;
    },

    async update(id: string, patch: Partial<Omit<T, keyof BaseEntity>>): Promise<T | null> {
      const items = readAll<T>(storageKey);
      let updated: T | null = null;
      const next = items.map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      });
      writeAll(storageKey, next);
      return updated;
    },

    async remove(id: string): Promise<void> {
      const items = readAll<T>(storageKey);
      writeAll(
        storageKey,
        items.filter((item) => item.id !== id)
      );
    },

    async replaceAll(items: T[]): Promise<T[]> {
      writeAll(storageKey, items);
      return items;
    },
  };
}
