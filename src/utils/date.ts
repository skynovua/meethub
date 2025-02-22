export const formatDateForInput = (date: Date) => {
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
};
