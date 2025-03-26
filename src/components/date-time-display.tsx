import { headers } from "next/headers";

import { formatDateWithWeekday } from "@/utils/date";

interface DateTimeDisplayProps {
  date: Date;
  className?: string;
}

export async function DateTimeDisplay({ date, className }: DateTimeDisplayProps) {
  const acceptLanguage = await headers();
  const locale = acceptLanguage.get("accept-language")?.split(",")[0] || "en-US";

  return <div className={className}>{formatDateWithWeekday(date, locale)}</div>;
}
