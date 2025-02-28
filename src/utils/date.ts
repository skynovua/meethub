export const formatDateForInput = (date: Date) => {
  return date.toISOString().slice(0, 16);
};

export const formatDateWithWeekday = (date: Date, locale: Intl.LocalesArgument) => {
  const formattedDate = date
    .toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(" о", "");
  const formattedWeekday = date.toLocaleDateString(locale, {
    weekday: "short",
  });

  return `${formattedDate}, ${formattedWeekday}`;
};
