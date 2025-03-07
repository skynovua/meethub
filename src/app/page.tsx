import { getAllEvents, getPopularEvents } from "@/actions/event";
import { EventCard } from "@/components/event-card";
import { SortSelect } from "@/components/sort-select";

export const revalidate = 600;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sort = (await searchParams).sort || "popular";

  let events;

  switch (sort) {
    case "popular":
      events = await getPopularEvents();
      break;
    case "upcoming":
    default:
      events = await getAllEvents({});
      break;
  }

  const sortedEvents = [...events];

  if (sort === "upcoming") {
    sortedEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <SortSelect currentSort={sort} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}
