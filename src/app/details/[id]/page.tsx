import { Calendar, MapPin } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getGoogleMapsUrl } from "@/utils/maps";

export const revalidate = 0;

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);

  if (!event) {
    return notFound();
  }

  const isFavorite = await isEventFavorite(event.id);
  const isBookmarked = await isEventBookmarked(event.id);
  const favoriteCount = event._count?.favorites || 0;
  const mapsUrl = getGoogleMapsUrl(event.address);

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
              <Calendar className="h-4 w-4" /> <DateTimeDisplay date={event.date} />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground inline-flex w-max items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{event.address}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Opens in a new tab</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="pt-4">
            <h3 className="mb-1 text-lg font-medium">Description</h3>
            <p className="prose lg:prose-x text-muted-foreground">{event.description}</p>
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
