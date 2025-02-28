import { headers } from "next/headers";

import { formatDateWithWeekday } from "@/utils/date";

interface DateTimeDisplayProps {
  date: Date;
}

export async function DateTimeDisplay({ date }: DateTimeDisplayProps) {
  const acceptLanguage = await headers();
  const locale = acceptLanguage.get("accept-language")?.split(",")[0] || "en-US";

  return formatDateWithWeekday(date, locale);
}
