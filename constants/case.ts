import type { CaseStatus } from "@/types/case";

export const CASE_STATUS_META: Record<
  CaseStatus,
  { label: string; badgeClass: string }
> = {
  received: {
    label: "รับคดี",
    badgeClass: "bg-white/10 text-zinc-300",
  },
  investigating: {
    label: "กำลังดำเนินการ",
    badgeClass: "bg-primary/15 text-primary",
  },
  pending_result: {
    label: "รอผล",
    badgeClass: "bg-warning/15 text-warning",
  },
  submitted: {
    label: "ส่งอัยการ",
    badgeClass: "bg-[#a855f7]/15 text-[#a855f7]",
  },
  closed: {
    label: "เสร็จสิ้น",
    badgeClass: "bg-success/15 text-success",
  },
};

export const CASE_STATUS_ORDER: CaseStatus[] = [
  "received",
  "investigating",
  "pending_result",
  "submitted",
  "closed",
];

export const CASE_CATEGORIES = [
  "คดีชีวิตและร่างกาย",
  "คดีเกี่ยวกับทรัพย์",
  "คดียาเสพติด",
  "คดีเพศ",
  "คดีฉ้อโกง",
  "คดีจราจร",
  "คดีอื่นๆ",
];

export type CaseSortMode = "createdAt" | "caseNumber" | "progress" | "priority";

export const CASE_SORT_META: Record<CaseSortMode, { label: string }> = {
  createdAt: { label: "วันที่สร้าง" },
  caseNumber: { label: "เลขคดี" },
  progress: { label: "Progress" },
  priority: { label: "ความสำคัญ" },
};

export const CASE_SORT_ORDER: CaseSortMode[] = ["createdAt", "caseNumber", "progress", "priority"];

export const DEFAULT_TIMELINE_STAGES = [
  "รับแจ้งเหตุ",
  "ตรวจสถานที่เกิดเหตุ",
  "สอบปากคำผู้เสียหาย",
  "สอบปากคำพยาน",
  "สอบปากคำผู้ต้องหา",
  "ส่งพิสูจน์หลักฐาน",
  "ส่งสำนวนอัยการ",
];

export const DEFAULT_CHECKLIST_ITEMS = [
  "รับแจ้งความ / บันทึกประจำวัน",
  "ตรวจสถานที่เกิดเหตุ",
  "รวบรวมพยานหลักฐาน",
  "สอบปากคำผู้เสียหาย",
  "สอบปากคำพยาน",
  "ออกหมายเรียก / หมายจับผู้ต้องหา",
  "สอบปากคำผู้ต้องหา",
  "สรุปสำนวนการสอบสวน",
  "ส่งสำนวนพนักงานอัยการ",
];
