"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskSearch({ value, onChange }: TaskSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="ค้นหางาน, แท็ก หรือเลขคดี"
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
