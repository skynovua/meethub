import Link from "next/link";

import { getEvents, getEventsByPopularity } from "@/actions/event";
import { EventCard } from "@/components/event-card";
import { SortSelect } from "@/components/sort-select";
import { Button } from "@/components/ui/button";

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
      events = await getEventsByPopularity();
      break;
    case "newest":
    default:
      events = await getEvents();
      break;
  }

  const sortedEvents = [...events];

  if (sort === "newest") {
    sortedEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }

  return (
    <>
      <div className="bg-background text-foreground container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button asChild>
            <Link href={"/edit/new"}> Create Event</Link>
          </Button>
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
