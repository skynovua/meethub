import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getEventById } from "@/actions/event";
import { isEventBookmarked, isEventFavorite } from "@/actions/favorite";
import { BookmarkButton } from "@/components/bookmark-button";
import { DateTimeDisplay } from "@/components/date-time-display";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 0;

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);

  if (!event) {
    return notFound();
  }

  const isFavorite = await isEventFavorite(event.id);
  const isBookmarked = await isEventBookmarked(event.id);

  const favoriteCount = event._count?.favorites || 0;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
          <div className="flex items-center gap-2">
            <BookmarkButton eventId={event.id} initialIsBookmarked={isBookmarked} />
            <FavoriteButton
              eventId={event.id}
              initialIsFavorite={isFavorite}
              favoriteCount={favoriteCount}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-80 w-full">
            <Image src={event.banner} alt={event.title} fill className="rounded-lg object-cover" />
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <DateTimeDisplay date={event.date} />
            </div>
            <div className="text-muted-foreground">{event.address}</div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
          </div>

          <div className="flex justify-between pt-6">
            <Button asChild variant="outline">
              <Link href="/">Back to Events</Link>
            </Button>
            <Button asChild>
              <Link href={`/edit/${event.id}`}>Edit Event</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
