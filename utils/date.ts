import {
  format,
  isToday as fnsIsToday,
  isSameDay as fnsIsSameDay,
  isWithinInterval,
  addDays,
} from "date-fns";
import { th } from "date-fns/locale";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? new Date(date) : date;
}

function buddhistYear(d: Date): number {
  return d.getFullYear() + 543;
}

/** e.g. "17 กรกฎาคม 2569" */
export function formatThaiDate(date: string | Date): string {
  const d = toDate(date);
  return `${format(d, "d MMMM", { locale: th })} ${buddhistYear(d)}`;
}

/** e.g. "วันศุกร์ที่ 17 กรกฎาคม 2569" */
export function formatThaiDateLong(date: string | Date): string {
  const d = toDate(date);
  return `วัน${format(d, "EEEEที่ d MMMM", { locale: th })} ${buddhistYear(d)}`;
}

export function formatThaiTime(date: string | Date): string {
  return `${format(toDate(date), "HH:mm")} น.`;
}

export function isToday(date: string | Date): boolean {
  return fnsIsToday(toDate(date));
}

export function isSameDay(a: string | Date, b: string | Date): boolean {
  return fnsIsSameDay(toDate(a), toDate(b));
}

export function isWithinNextDays(date: string | Date, days: number): boolean {
  const now = new Date();
  return isWithinInterval(toDate(date), { start: now, end: addDays(now, days) });
}

export function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "สวัสดีตอนเช้า";
  if (hour < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}
