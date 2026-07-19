"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CaseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaseSearch({ value, onChange }: CaseSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="ค้นหาเลขคดี ชื่อคดี หรือชื่อบุคคล"
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
