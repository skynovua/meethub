import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DateTimeDisplay } from "@/components/date-time-display";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { EventWithDetails } from "@/types/event";

interface EventCardProps {
  event: EventWithDetails;
}

export async function EventCard({ event }: EventCardProps) {
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <Card
      className={`flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-md ${isPastEvent ? "opacity-75" : ""}`}
    >
      <Link key={event.id} href={`/events/${event.id}`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {isPastEvent && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
              <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
                Past Event
              </span>
            </div>
          )}
          <Image
            src={event.banner}
            alt={event.title}
            fill
            className={`scale-100 object-cover transition-all duration-200 ${isPastEvent ? "" : "hover:scale-105"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <DateTimeDisplay date={event.date} />
        </div>
        <Link key={event.id} href={`/events/${event.id}`}>
          <h3 className="line-clamp-2 text-lg font-semibold">{event.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground line-clamp-2 text-sm">{event.description}</p>
      </CardContent>
      <CardFooter className="mt-auto flex items-center gap-2 pt-2 text-sm">
        <MapPin className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground truncate">{event.address || "Online Event"}</span>
      </CardFooter>
    </Card>
  );
}
