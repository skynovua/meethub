import { headers } from "next/headers";

interface DateTimeDisplayProps {
  date: Date;
}

export async function DateTimeDisplay({ date }: DateTimeDisplayProps) {
  const acceptLanguage = await headers();
  const locale = acceptLanguage.get("accept-language")?.split(",")[0] || "en-US";

  return (
    <>
      {new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date)}
    </>
  );
}
