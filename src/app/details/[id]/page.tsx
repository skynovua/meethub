import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getEventById } from "@/actions/event";
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

export default async function Details({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const event = await getEventById(id);

  if (!event) {
    redirect("/");
  }

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>
            <DateTimeDisplay date={event.date} /> - {event.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {event.banner && (
            <div className="relative mb-4 h-80 w-full">
              <Image
                src={event.banner || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <p>{event.description}</p>
        </CardContent>
        <CardFooter>
          <Button className="mr-2" asChild>
            <Link href={`/edit/${event.id}`}>Edit</Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={"/"}>Cancel Event</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
