import { Event } from "@prisma/client";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { isEventBookmarked, isEventFavorite } from "@/actions/favorite";
import { BookmarkButton } from "@/components/bookmark-button";
import { DateTimeDisplay } from "@/components/date-time-display";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EventCardProps {
  event: Event & {
    _count: {
      favorites: number;
    };
  };
}

export async function EventCard({ event }: EventCardProps) {
  const isFavorite = await isEventFavorite(event.id);
  const isBookmarked = await isEventBookmarked(event.id);

  const favoriteCount = event._count?.favorites || 0;

  return (
    <Card key={event.id} className="flex h-full flex-col overflow-hidden">
      {/* Image container with no horizontal padding or margin */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={event.banner}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {/* Overlay for bookmark button */}
        <div className="absolute top-2 right-2">
          <BookmarkButton
            eventId={event.id}
            initialIsBookmarked={isBookmarked}
            variant="secondary"
            size="sm"
          />
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-4 w-4" /> <DateTimeDisplay date={event.date} />
        </CardDescription>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {event.address}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter className="mt-auto flex justify-between">
        <Button asChild>
          <Link href={`/details/${event.id}`}>View Details</Link>
        </Button>
        <FavoriteButton
          eventId={event.id}
          initialIsFavorite={isFavorite}
          favoriteCount={favoriteCount}
        />
      </CardFooter>
    </Card>
  );
}
