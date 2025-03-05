import { Event } from "@prisma/client";

import { EventFormData } from "@/lib/schemas";
import { formatDateForInput } from "@/utils/date";

export const transformEventToFormData = (
  data: Event | null,
  id: string,
): (EventFormData & { id: string }) | null => {
  if (!data) {
    return null;
  }

  return {
    ...data,
    date: formatDateForInput(data.date),
    id: id.toString(),
  };
};
