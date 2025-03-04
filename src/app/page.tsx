import Image from "next/image";
import Link from "next/link";

import { getEvents } from "@/actions/event";
import { DateTimeDisplay } from "@/components/date-time-display";
import { SortSelect } from "@/components/sort-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const revalidate = 600;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const events = await getEvents();
  const sort = (await searchParams).sort;

  // Sort events based on the sort parameter
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sort === "oldest" ? dateA - dateB : dateB - dateA;
  });

  return (
    <>
      <div className="bg-background text-foreground container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button asChild>
            <Link href={"/edit/new"}> Create Event</Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <SortSelect currentSort={sort || "newest"} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedEvents.map((event, index) => (
            <Card key={event.id} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  <DateTimeDisplay date={event.date} />
                  <div>{event.address}</div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="relative h-40 w-full">
                  <Image
                    src={event.banner}
                    alt={event.title}
                    fill
                    className="rounded-md object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                    quality={80}
                  />
                </div>
                <p className="line-clamp-2">{event.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button asChild>
                  <Link href={`/details/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
