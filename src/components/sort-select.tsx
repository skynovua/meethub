"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    router.push(`/?sort=${value}`);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort events" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="popular">Most popular</SelectItem>
        <SelectItem value="newest">Upcoming</SelectItem>
      </SelectContent>
    </Select>
  );
}
