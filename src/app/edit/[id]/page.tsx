import { getEventById } from "@/actions/event";
import EventForm from "@/components/event-form";
import { formatDateForInput } from "@/utils/date";

interface EventPageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMeetup({ params }: EventPageParams) {
  const { id } = await params;
  const isNewMeetup = id === "new";

  const event = isNewMeetup
    ? null
    : await getEventById(id).then((event) => {
        if (!event) {
          throw new Error("Event not found");
        }

        return {
          ...event,
          date: formatDateForInput(event.date),
        };
      });

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <EventForm event={event} />
    </div>
  );
}
