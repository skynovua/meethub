import { Event } from "@prisma/client";
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
    <Card key={event.id} className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{event.title}</CardTitle>
          <BookmarkButton eventId={event.id} initialIsBookmarked={isBookmarked} />
        </div>
        <CardDescription>
          <DateTimeDisplay date={event.date} />
          <div>{event.address}</div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative h-40 w-full">
          <Image src={event.banner} alt={event.title} fill className="rounded-md object-cover" />
        </div>
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
