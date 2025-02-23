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
    title: data.title,
    description: data.description,
    date: formatDateForInput(data.date),
    address: data.address,
    banner: data.banner,
    id: id.toString(),
  };
};
