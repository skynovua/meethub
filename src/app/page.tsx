import Image from "next/image";
import Link from "next/link";

import { getEvents } from "@/actions/event";
import { DateTimeDisplay } from "@/components/date-time-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
  const events = await getEvents();

  return (
    <>
      <div className="bg-background text-foreground container mx-auto p-4">
        <Button className="mb-4" asChild>
          <Link href={"/edit/new"}> Create Meetup</Link>
        </Button>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  <DateTimeDisplay date={event.date} /> - {event.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="relative h-40 w-full">
                  <Image src={event.banner} alt={event.title} fill objectFit="cover" />
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
