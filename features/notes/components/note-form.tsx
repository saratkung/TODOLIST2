"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { NoteInput } from "@/types/note";

const noteSchema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  content: z.string().min(1, "กรุณากรอกเนื้อหา"),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

interface NoteFormProps {
  defaultValues?: Partial<NoteFormValues>;
  onSubmit: (input: NoteInput) => void;
  submitLabel?: string;
}

export function NoteForm({ defaultValues, onSubmit, submitLabel = "บันทึกโน้ต" }: NoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  function submit(values: NoteFormValues) {
    onSubmit({ title: values.title, content: values.content });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="note-title">หัวข้อ</Label>
        <Input id="note-title" {...register("title")} />
        {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="note-content">เนื้อหา (รองรับ Markdown)</Label>
        <Textarea id="note-content" rows={8} className="font-mono text-sm" {...register("content")} />
        {errors.content && <p className="text-xs text-danger">{errors.content.message}</p>}
      </div>
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
