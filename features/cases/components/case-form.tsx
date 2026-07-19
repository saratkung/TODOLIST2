"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META, PRIORITY_ORDER } from "@/constants/task";
import { CASE_STATUS_META, CASE_STATUS_ORDER, CASE_CATEGORIES } from "@/constants/case";
import type { CaseInput } from "@/types/case";

const caseSchema = z.object({
  caseNumber: z.string().min(1, "กรุณากรอกเลขคดี"),
  title: z.string().min(1, "กรุณากรอกชื่อคดี"),
  category: z.string().min(1, "กรุณาเลือกประเภทคดี"),
  description: z.string().optional(),
  complainant: z.string().optional(),
  victim: z.string().optional(),
  suspect: z.string().optional(),
  officer: z.string().min(1, "กรุณากรอกชื่อพนักงานสอบสวน"),
  status: z.enum(["received", "investigating", "pending_result", "submitted", "closed"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  deadline: z.string().optional(),
  custodyDeadline: z.string().optional(),
  submissionDeadline: z.string().optional(),
});

export type CaseFormValues = z.infer<typeof caseSchema>;

interface CaseFormProps {
  defaultValues?: Partial<CaseFormValues>;
  onSubmit: (input: CaseInput) => void;
  submitLabel?: string;
}

export function CaseForm({ defaultValues, onSubmit, submitLabel = "สร้างคดี" }: CaseFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      status: "received",
      priority: "medium",
      category: CASE_CATEGORIES[0],
      ...defaultValues,
    },
  });

  const status = watch("status");
  const priority = watch("priority");
  const category = watch("category");

  function submit(values: CaseFormValues) {
    onSubmit({
      caseNumber: values.caseNumber,
      title: values.title,
      category: values.category,
      description: values.description || undefined,
      complainant: values.complainant || undefined,
      victim: values.victim || undefined,
      suspect: values.suspect || undefined,
      officer: values.officer,
      status: values.status,
      priority: values.priority,
      deadline: values.deadline ? new Date(values.deadline).toISOString() : undefined,
      custodyDeadline: values.custodyDeadline
        ? new Date(values.custodyDeadline).toISOString()
        : undefined,
      submissionDeadline: values.submissionDeadline
        ? new Date(values.submissionDeadline).toISOString()
        : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="caseNumber">เลขคดี</Label>
          <Input id="caseNumber" placeholder="2569/xxx" {...register("caseNumber")} />
          {errors.caseNumber && <p className="text-xs text-danger">{errors.caseNumber.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="officer">พนักงานสอบสวน</Label>
          <Input id="officer" {...register("officer")} />
          {errors.officer && <p className="text-xs text-danger">{errors.officer.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">ชื่อคดี</Label>
        <Input id="title" placeholder="เช่น ลักทรัพย์ในเคหสถาน" {...register("title")} />
        {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>ประเภทคดี</Label>
        <Select value={category} onValueChange={(v) => v && setValue("category", v)}>
          <SelectTrigger className="w-full">
            <SelectValue>{(v: string) => v}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CASE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">รายละเอียด</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="complainant">ผู้ร้อง</Label>
          <Input id="complainant" {...register("complainant")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="victim">ผู้เสียหาย</Label>
          <Input id="victim" {...register("victim")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="suspect">ผู้ต้องหา</Label>
          <Input id="suspect" {...register("suspect")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>สถานะ</Label>
          <Select value={status} onValueChange={(v) => v && setValue("status", v as CaseFormValues["status"])}>
            <SelectTrigger className="w-full">
              <SelectValue>{(v: string) => CASE_STATUS_META[v as keyof typeof CASE_STATUS_META]?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CASE_STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {CASE_STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>ความสำคัญ</Label>
          <Select value={priority} onValueChange={(v) => v && setValue("priority", v as CaseFormValues["priority"])}>
            <SelectTrigger className="w-full">
              <SelectValue>{(v: string) => PRIORITY_META[v as keyof typeof PRIORITY_META]?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_ORDER.map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_META[p].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="deadline">ครบกำหนด</Label>
          <Input id="deadline" type="date" {...register("deadline")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="custodyDeadline">ฝากขังถึง</Label>
          <Input id="custodyDeadline" type="date" {...register("custodyDeadline")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="submissionDeadline">ส่งสำนวน</Label>
          <Input id="submissionDeadline" type="date" {...register("submissionDeadline")} />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
