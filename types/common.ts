export type Priority = "low" | "medium" | "high" | "urgent";

export type ReminderOffset = "15m" | "30m" | "1h" | "1d" | "7d";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}
