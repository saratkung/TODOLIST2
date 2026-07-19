import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  FolderClosed,
  NotebookPen,
  BarChart3,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Cases", href: "/cases", icon: FolderClosed },
  { label: "Notes", href: "/notes", icon: NotebookPen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Profile", href: "/profile", icon: UserRound },
];
