export const formatDateForInput = (date: Date) => {
  return date.toISOString().slice(0, 16);
};

export const formatDateWithWeekday = (date: Date | string, locale: Intl.LocalesArgument) => {
  const formattedDate = new Date(date)
    .toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(" о", "");
  const formattedWeekday = new Date(date).toLocaleDateString(locale, {
    weekday: "short",
  });

  return `${formattedDate}, ${formattedWeekday}`;
};
