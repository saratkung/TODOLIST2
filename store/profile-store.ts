import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProfileState {
  firstName: string;
  lastName: string;
  /** Derived full name, kept in sync with firstName/lastName. Read directly by the Dashboard greeting. */
  name: string;
  /** Police rank prefix (e.g. "ร.ต.อ."), shown alone in the Dashboard greeting. */
  rank: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  memberSince: string;
  notificationsEnabled: boolean;
  setProfile: (
    patch: Partial<
      Pick<
        ProfileState,
        | "firstName"
        | "lastName"
        | "rank"
        | "position"
        | "department"
        | "email"
        | "phone"
      >
    >
  ) => void;
  setAvatar: (url: string | null) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      firstName: "วีระ",
      lastName: "ศักดิ์สิทธิ์",
      name: "วีระ ศักดิ์สิทธิ์",
      rank: "ร.ต.อ.",
      position: "พนักงานสอบสวน",
      department: "สถานีตำรวจนครบาลบางรัก",
      email: "weera.s@police.go.th",
      phone: "",
      avatarUrl: null,
      memberSince: "2024-01-15T00:00:00.000Z",
      notificationsEnabled: true,

      setProfile: (patch) =>
        set((state) => {
          const next = { ...state, ...patch };
          if (patch.firstName !== undefined || patch.lastName !== undefined) {
            next.name = fullName(next.firstName, next.lastName);
          }
          return next;
        }),

      setAvatar: (url) => set({ avatarUrl: url }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    { name: "investigator:profile" }
  )
);
