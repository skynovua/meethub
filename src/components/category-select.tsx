"use client";

import { EventCategory } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_DISPLAY_NAMES, EVENT_CATEGORIES } from "@/lib/constants";

interface CategorySelectProps {
  value: EventCategory;
  onChange: (value: EventCategory) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as EventCategory)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category">
          {value ? CATEGORY_DISPLAY_NAMES[value as EventCategory] : "Select a category"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {EVENT_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {CATEGORY_DISPLAY_NAMES[category as EventCategory]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
