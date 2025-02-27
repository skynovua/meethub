import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getEventById } from "@/actions/event";
import { getUserById } from "@/actions/user";
import { DateTimeDisplay } from "@/components/date-time-display";
import { EventDeleteButton } from "@/components/event-delete-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/core/auth";

export default async function Details({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const event = await getEventById(id);
  const session = await auth();

  if (!event || !session) {
    redirect("/");
  }

  const user = await getUserById(event?.user_id);

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
          <p className="mt-4">
            <strong>Hosted by:</strong> {user?.name}
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between">
            <Button asChild variant={"outline"}>
              <Link href="/">Back</Link>
            </Button>
            {event.user_id === session?.user?.id && (
              <div>
                <Button className="mr-2" asChild>
                  <Link href={`/edit/${event.id}`}>Edit</Link>
                </Button>
                <EventDeleteButton eventID={id} />
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
