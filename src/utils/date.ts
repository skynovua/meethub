export const formatDateForInput = (date: Date) => {
  return date.toISOString().slice(0, 16);
};
