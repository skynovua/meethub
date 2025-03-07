import { redirect } from "next/navigation";

import { getEventById } from "@/actions/event";
import { EventForm } from "@/components/event-form";
import { auth } from "@/core/auth";
import { transformEventToFormData } from "@/utils/event";

interface EventPageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMeetup({ params }: EventPageParams) {
  const { id } = await params;
  const isNewMeetup = id === "new";

  const event = isNewMeetup ? null : await getEventById(id);
  const session = await auth();

  if (event && session?.user?.id !== event.user_id) {
    return redirect("/");
  }

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <EventForm event={transformEventToFormData(event, id)} />
    </div>
  );
}
