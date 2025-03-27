"use client";

import { formatDateWithWeekday } from "@/utils/date";

interface DateTimeDisplayProps {
  date: Date;
  className?: string;
}

export function DateTimeDisplay({ date, className }: DateTimeDisplayProps) {
  return <div className={className}>{formatDateWithWeekday(date, "en-EU")}</div>;
}
