import EventForm from "@/components/event-form";
import { meetups } from "@/data/meetups";

interface EventPageParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMeetup({ params }: EventPageParams) {
  const { id } = await params;
  const isNewMeetup = id === "new";

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <EventForm meet={meetups[0]} isUpdate={!isNewMeetup} />
    </div>
  );
}
