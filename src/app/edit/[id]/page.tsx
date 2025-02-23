import { getEventById } from "@/actions/event";
import { EventForm } from "@/components/event-form";
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

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <EventForm event={transformEventToFormData(event, id)} />
    </div>
  );
}
