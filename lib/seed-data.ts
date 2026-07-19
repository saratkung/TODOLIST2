import { generateId } from "@/lib/id";
import { LOCAL_OWNER_ID } from "@/lib/local-repository";
import { DEFAULT_CHECKLIST_ITEMS, DEFAULT_TIMELINE_STAGES } from "@/constants/case";
import type { Task } from "@/types/task";
import type { CaseFile, ChecklistItem, TimelineEvent } from "@/types/case";
import type { CalendarEvent } from "@/types/calendar";
import type { Note } from "@/types/note";

const CASE_A = "case-seed-2569-041";
const CASE_B = "case-seed-2569-055";
const CASE_C = "case-seed-2569-062";

function iso(daysFromNow: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function base() {
  const now = new Date().toISOString();
  return { id: generateId(), ownerId: LOCAL_OWNER_ID, createdAt: now, updatedAt: now };
}

export function seedCases(): CaseFile[] {
  const now = new Date().toISOString();
  return [
    {
      id: CASE_A,
      ownerId: LOCAL_OWNER_ID,
      createdAt: now,
      updatedAt: now,
      caseNumber: "2569/041",
      title: "ลักทรัพย์ในเคหสถาน",
      category: "คดีเกี่ยวกับทรัพย์",
      description: "คนร้ายงัดประตูหลังบ้านเข้าไปลักทรัพย์สินขณะผู้เสียหายไม่อยู่บ้าน",
      complainant: "นายสมชาย ใจดี",
      victim: "นางสาวพิมพ์ชนก แสงทอง",
      suspect: "ไม่ทราบชื่อ",
      officer: "ร.ต.อ.วีระ ศักดิ์สิทธิ์",
      status: "investigating",
      priority: "high",
      deadline: iso(6),
      custodyDeadline: iso(2),
      submissionDeadline: iso(10),
    },
    {
      id: CASE_B,
      ownerId: LOCAL_OWNER_ID,
      createdAt: now,
      updatedAt: now,
      caseNumber: "2569/055",
      title: "ทำร้ายร่างกาย",
      category: "คดีชีวิตและร่างกาย",
      complainant: "นายอนุชา พงษ์ไพร",
      victim: "นายอนุชา พงษ์ไพร",
      suspect: "นายกิตติ มั่นคง",
      officer: "ร.ต.อ.วีระ ศักดิ์สิทธิ์",
      status: "pending_result",
      priority: "urgent",
      deadline: iso(1),
      custodyDeadline: iso(0),
      submissionDeadline: iso(3),
    },
    {
      id: CASE_C,
      ownerId: LOCAL_OWNER_ID,
      createdAt: now,
      updatedAt: now,
      caseNumber: "2569/062",
      title: "ฉ้อโกงประชาชน",
      category: "คดีฉ้อโกง",
      complainant: "บริษัท เอสเอ็มอี จำกัด",
      victim: "บริษัท เอสเอ็มอี จำกัด",
      suspect: "นางสาวกัญญา รุ่งเรือง",
      officer: "ร.ต.อ.วีระ ศักดิ์สิทธิ์",
      status: "investigating",
      priority: "medium",
      deadline: iso(14),
      submissionDeadline: iso(20),
    },
  ];
}

export function seedChecklistItems(): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  [CASE_A, CASE_B, CASE_C].forEach((caseId, caseIndex) => {
    DEFAULT_CHECKLIST_ITEMS.forEach((title, index) => {
      items.push({
        ...base(),
        caseId,
        parentId: null,
        title,
        completed: caseIndex === 0 ? index < 4 : caseIndex === 1 ? index < 7 : index < 2,
        order: index,
      });
    });
  });
  return items;
}

export function seedTimelineEvents(): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  [CASE_A, CASE_B, CASE_C].forEach((caseId, caseIndex) => {
    const completedStages = caseIndex === 0 ? 4 : caseIndex === 1 ? 6 : 2;
    for (let i = 0; i < completedStages; i++) {
      events.push({
        ...base(),
        caseId,
        title: DEFAULT_TIMELINE_STAGES[i],
        timestamp: iso(-14 + i * 2, 10),
        order: i,
      });
    }
  });
  return events;
}

export function seedTasks(): Task[] {
  const rows: Array<Omit<Task, keyof ReturnType<typeof base>> & { order: number }> = [
    {
      title: "สอบปากคำผู้เสียหาย คดี 2569/041",
      description: "นัดที่โรงพัก เวลา 09:00 น.",
      completed: false,
      priority: "high",
      tags: ["สอบปากคำ"],
      dueDate: iso(0, 9),
      reminder: "1h",
      recurrence: "none",
      caseId: CASE_A,
      order: 0,
    },
    {
      title: "ยื่นคำร้องฝากขังผู้ต้องหา คดี 2569/055",
      completed: false,
      priority: "urgent",
      tags: ["ฝากขัง", "ศาล"],
      dueDate: iso(0, 13),
      reminder: "1h",
      recurrence: "none",
      caseId: CASE_B,
      order: 1,
    },
    {
      title: "รวบรวมพยานหลักฐานเพิ่มเติม คดี 2569/062",
      completed: false,
      priority: "medium",
      tags: ["พยานหลักฐาน"],
      dueDate: iso(3, 15),
      reminder: "1d",
      recurrence: "none",
      caseId: CASE_C,
      order: 2,
    },
    {
      title: "ตรวจสอบกล้องวงจรปิดบริเวณที่เกิดเหตุ",
      completed: true,
      priority: "medium",
      tags: ["ตรวจสถานที่"],
      dueDate: iso(-1, 10),
      recurrence: "none",
      caseId: CASE_A,
      order: 3,
    },
    {
      title: "สรุปรายงานประจำสัปดาห์",
      completed: false,
      priority: "low",
      tags: ["ธุรการ"],
      dueDate: iso(2, 17),
      recurrence: "weekly",
      order: 4,
    },
    {
      title: "ประชุมทีมสอบสวนประจำเดือน",
      completed: false,
      priority: "medium",
      tags: ["ประชุม"],
      dueDate: iso(4, 13, 30),
      recurrence: "monthly",
      order: 5,
    },
  ];
  return rows.map((row) => ({ ...base(), ...row }));
}

export function seedCalendarEvents(): CalendarEvent[] {
  const now = new Date();
  const rows: Array<Omit<CalendarEvent, keyof ReturnType<typeof base>>> = [
    {
      title: "สอบปากคำผู้เสียหาย คดี 2569/041",
      start: iso(0, 9),
      end: iso(0, 10),
      allDay: false,
      category: "investigation",
      caseId: CASE_A,
    },
    {
      title: "ฝากขังผู้ต้องหา คดี 2569/055",
      start: iso(0, 13),
      end: iso(0, 14),
      allDay: false,
      category: "custody",
      caseId: CASE_B,
    },
    {
      title: "นัดหมายผู้ร้อง คดี 2569/062",
      start: iso(1, 10),
      end: iso(1, 11),
      allDay: false,
      category: "appointment",
      caseId: CASE_C,
    },
    {
      title: "ส่งสำนวนอัยการ คดี 2569/055",
      start: iso(3, 9),
      allDay: true,
      category: "submission",
      caseId: CASE_B,
    },
    {
      title: "ประชุมทีมสอบสวนประจำเดือน",
      start: iso(4, 13, 30),
      end: iso(4, 15),
      allDay: false,
      category: "meeting",
    },
    {
      title: "ตรวจสถานที่เกิดเหตุ คดี 2569/062",
      start: iso(-2, 14),
      end: iso(-2, 16),
      allDay: false,
      category: "investigation",
      caseId: CASE_C,
    },
  ];
  void now;
  return rows.map((row) => ({ ...base(), ...row }));
}

export function seedNotes(): Note[] {
  const rows: Array<Omit<Note, keyof ReturnType<typeof base>>> = [
    {
      title: "แนวทางการสอบสวนคดีลักทรัพย์",
      content:
        "- ตรวจสอบกล้องวงจรปิดในรัศมี 500 เมตร\n- สอบถามเพื่อนบ้านที่อยู่ใกล้เคียง\n- ตรวจสอบประวัติการเข้า-ออกพื้นที่",
      pinned: true,
      favorite: true,
      caseId: CASE_A,
    },
    {
      title: "เบอร์ติดต่อพยาน",
      content: "พยานปากที่ 1: 08x-xxx-xxxx\nพยานปากที่ 2: 09x-xxx-xxxx",
      pinned: false,
      favorite: false,
      caseId: CASE_B,
    },
    {
      title: "สิ่งที่ต้องเตรียมก่อนส่งสำนวน",
      content: "1. สำเนาบันทึกคำให้การ\n2. รายงานผลตรวจพิสูจน์\n3. บัญชีของกลาง",
      pinned: true,
      favorite: false,
    },
  ];
  return rows.map((row) => ({ ...base(), ...row }));
}
