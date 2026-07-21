import { create } from "zustand";

export type GoogleConnectionStatus =
  | "checking"
  | "disconnected"
  | "connecting"
  | "connected"
  | "syncing"
  | "error";

interface GoogleCalendarState {
  status: GoogleConnectionStatus;
  configured: boolean | null;
  googleEmail: string | null;
  lastSync: string | null;
  errorMessage: string | null;
  setConnecting: () => void;
  setConnected: (email: string) => void;
  setDisconnected: () => void;
  setSyncing: () => void;
  setSynced: () => void;
  setSyncError: (message: string) => void;
  /** Fetches real connection state from /api/auth/google/status. */
  checkStatus: () => Promise<void>;
}

export const useGoogleCalendarStore = create<GoogleCalendarState>((set) => ({
  status: "checking",
  configured: null,
  googleEmail: null,
  lastSync: null,
  errorMessage: null,

  setConnecting: () => set({ status: "connecting", errorMessage: null }),
  setConnected: (email) => set({ status: "connected", googleEmail: email, errorMessage: null }),
  setDisconnected: () => set({ status: "disconnected", googleEmail: null, lastSync: null, errorMessage: null }),
  setSyncing: () => set({ status: "syncing" }),
  setSynced: () => set({ status: "connected", lastSync: new Date().toISOString(), errorMessage: null }),
  setSyncError: (message) => set({ status: "error", errorMessage: message }),

  checkStatus: async () => {
    try {
      const res = await fetch("/api/auth/google/status");
      const data: { configured: boolean; connected: boolean; email: string | null } = await res.json();
      set({
        configured: data.configured,
        status: data.connected ? "connected" : "disconnected",
        googleEmail: data.email,
      });
    } catch {
      set({ configured: false, status: "disconnected", googleEmail: null });
    }
  },
}));
