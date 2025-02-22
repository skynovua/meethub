"use client";

import { useEffect, useState } from "react";

interface DateTimeProps {
  date: Date;
}

export default function DateTime({ date }: DateTimeProps) {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState("en-US");

  useEffect(() => {
    setMounted(true);
    setLocale(navigator.language);
  }, []);

  if (!mounted) {
    return null;
  }

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
