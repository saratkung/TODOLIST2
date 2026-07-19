import type { EventCategory } from "@/types/calendar";

export const EVENT_CATEGORY_META: Record<
  EventCategory,
  { label: string; emoji: string; color: string; badgeClass: string }
> = {
  investigation: {
    label: "สอบสวน",
    emoji: "🔵",
    color: "#2563EB",
    badgeClass: "bg-cat-investigation/15 text-cat-investigation",
  },
  submission: {
    label: "ส่งสำนวน",
    emoji: "🟢",
    color: "#22C55E",
    badgeClass: "bg-cat-submission/15 text-cat-submission",
  },
  appointment: {
    label: "นัดหมาย",
    emoji: "🟠",
    color: "#F59E0B",
    badgeClass: "bg-cat-appointment/15 text-cat-appointment",
  },
  custody: {
    label: "ฝากขัง",
    emoji: "🔴",
    color: "#EF4444",
    badgeClass: "bg-cat-custody/15 text-cat-custody",
  },
  meeting: {
    label: "ประชุม",
    emoji: "🟣",
    color: "#A855F7",
    badgeClass: "bg-cat-meeting/15 text-cat-meeting",
  },
};

export const EVENT_CATEGORY_ORDER: EventCategory[] = [
  "investigation",
  "submission",
  "appointment",
  "custody",
  "meeting",
];
