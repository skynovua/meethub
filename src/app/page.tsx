import Link from "next/link";

import { getEvents } from "@/actions/event";
import DateTime from "@/components/date-time";
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
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  <DateTime date={event.date} /> - {event.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
              </CardContent>
              <CardFooter>
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
