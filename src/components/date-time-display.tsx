"use client";

import { formatDateWithWeekday } from "@/utils/date";

interface DateTimeDisplayProps {
  date: Date;
  className?: string;
}

export function DateTimeDisplay({ date, className }: DateTimeDisplayProps) {
  console.log("date", date);

  return <div className={className}>{formatDateWithWeekday(date, "en-EU")}</div>;
}
