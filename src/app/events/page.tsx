import { Suspense } from "react";

import { Metadata } from "next";

import { getAllEvents } from "@/actions/event";
import { EventFilters } from "@/components/events/event-filters";
import { EventGrid } from "@/components/events/event-grid";
import { EventsSearch } from "@/components/events/events-search";
import { SelectedFilters } from "@/components/events/selected-filters";
import { PageHeading } from "@/components/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Events | MeetHub",
  description: "Discover upcoming events and meetups",
};

interface EventsPageProps {
  searchParams: {
    query?: string;
    category?: string;
    date?: string;
    page?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const query = searchParams.query || "";
  const category = searchParams.category || "all";
  const date = searchParams.date || "upcoming";
  const page = Number(searchParams.page) || 1;

  const events = await getAllEvents({ query, category, date, page, limit: 12 });

  return (
    <div className="container mx-auto space-y-8 p-4 py-6">
      <PageHeading
        title="Discover Events"
        description="Find and join upcoming events and meetups"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[250px_1fr]">
        <div>
          <EventFilters selectedCategory={category} selectedDate={date} />
        </div>

        <div className="space-y-6">
          <EventsSearch defaultValue={query} />

          <SelectedFilters query={query} category={category} date={date} />

          <Suspense fallback={<EventGridSkeleton />}>
            <EventGrid
              events={events}
              hasFilters={!!(query || category !== "all" || date !== "upcoming")}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function EventGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
    </div>
  );
}
