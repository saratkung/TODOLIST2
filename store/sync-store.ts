import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SyncStatus = "idle" | "saving" | "saved" | "error";

interface SyncState {
  status: SyncStatus;
  lastSavedAt: string | null;
  errorMessage: string | null;
  notifySaving: () => void;
  notifySaved: () => void;
  notifyError: (message: string) => void;
}

/**
 * Tracks the status of writes to this device's local storage.
 *
 * There is no real cloud backend connected yet (see
 * supabase/migrations/), so this deliberately reports on local saves
 * only — it must not claim data is "synced" across devices when it
 * isn't. Swap the notify* calls for real network status once a
 * Supabase project is wired up.
 *
 * lastSavedAt is persisted so it survives a full page reload (matches
 * how a real "last synced" indicator behaves); the transient `status`
 * itself is not persisted — a fresh load always starts "idle" and only
 * becomes "saving"/"saved"/"error" in response to an actual write in
 * that session.
 */
export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      status: "idle",
      lastSavedAt: null,
      errorMessage: null,

      notifySaving: () => set({ status: "saving" }),

      notifySaved: () =>
        set({ status: "saved", lastSavedAt: new Date().toISOString(), errorMessage: null }),

      notifyError: (message) => set({ status: "error", errorMessage: message }),
    }),
    {
      name: "investigator:sync-status",
      partialize: (state) => ({ lastSavedAt: state.lastSavedAt }),
    }
  )
);
