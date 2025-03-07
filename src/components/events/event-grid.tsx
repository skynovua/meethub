import { EventCard } from "@/components/event-card";
import { EventWithDetails } from "@/types/event";

interface EventGridProps {
  events: EventWithDetails[];
  hasFilters: boolean;
}

export function EventGrid({ events, hasFilters }: EventGridProps) {
  if (!events.length) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-2xl font-semibold">No events found</h3>
        <p className="text-muted-foreground mb-6">
          {hasFilters
            ? "Try adjusting your filters or search terms"
            : "There are currently no events scheduled"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  );
}
