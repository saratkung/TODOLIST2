import { create } from "zustand";

export type CreateDialogKind = "task" | "case" | "note" | "event" | null;

interface UiState {
  createDialog: CreateDialogKind;
  createDialogDefaults: Record<string, unknown> | undefined;
  openCreateDialog: (kind: Exclude<CreateDialogKind, null>, defaults?: Record<string, unknown>) => void;
  closeCreateDialog: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  createDialog: null,
  createDialogDefaults: undefined,
  openCreateDialog: (kind, defaults) => set({ createDialog: kind, createDialogDefaults: defaults }),
  closeCreateDialog: () => set({ createDialog: null, createDialogDefaults: undefined }),
}));
