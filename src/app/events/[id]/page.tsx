import { EventCategory } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Calendar, MapPin, Share2, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getEventById } from "@/actions/event";
import { isEventBookmarked, isEventFavorite } from "@/actions/favorite";
import { getUserById } from "@/actions/user";
import { BookmarkButton } from "@/components/bookmark-button";
import { CategoryBadge } from "@/components/category-badge";
import { DateTimeDisplay } from "@/components/date-time-display";
import { EventDeleteButton } from "@/components/event-delete-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ShareDialog } from "@/components/share-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { auth } from "@/core/auth";
import { getGoogleMapsUrl } from "@/utils/maps";

export const revalidate = 0;

// Динамічні метадані для сторінки деталей події
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
      return {
        title: "Event Not Found | MeetHub",
        description: "The requested event could not be found.",
      };
    }

    const organizer = await getUserById(event.user_id);
    const eventDate = new Date(event.date);

    return {
      title: `${event.title} | MeetHub`,
      description: event.description.substring(0, 160),
      openGraph: {
        title: event.title,
        description: event.description.substring(0, 160),
        images: [{ url: event.banner }],
        type: "article",
        publishedTime: event.created_at.toISOString(),
        authors: organizer?.name || "MeetHub Organizer",
        siteName: "MeetHub",
      },
    };
  } catch (error) {
    return {
      title: "Event Details | MeetHub",
      description: "View details of this exciting event on MeetHub.",
    };
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const event = await getEventById(id);

  if (!event) {
    return notFound();
  }

  const organizer = await getUserById(event.user_id);
  const isFavorite = await isEventFavorite(event.id);
  const isBookmarked = await isEventBookmarked(event.id);
  const mapsUrl = getGoogleMapsUrl(event.address);
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{event.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="overflow-hidden border-none shadow-lg">
        {/* Full-width image at the top */}
        <div className="relative aspect-[16/9] w-full">
          {!isUpcoming && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
              <span className="text-md rounded-md bg-red-500 px-3 py-2 font-bold text-white">
                Past Event
              </span>
            </div>
          )}
          <Image
            src={event.banner}
            alt={event.title}
            fill
            className={`object-cover ${!isUpcoming ? "opacity-90" : ""}`}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          {/* Overlay for buttons */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <BookmarkButton
              eventId={event.id}
              initialIsBookmarked={isBookmarked}
              variant="secondary"
            />
            <FavoriteButton
              eventId={event.id}
              initialIsFavorite={isFavorite}
              favoriteCount={event.favoriteCount}
              variant="secondary"
              size="default"
              showCount
            />
            <ShareDialog
              url={`${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}`}
              title={event.title}
            >
              <Button variant="secondary" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </ShareDialog>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <CategoryBadge categoryValue={event.category || EventCategory.OTHER} />
          </div>
        </div>

        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
            {isUpcoming ? (
              <Badge variant="outline" className="mt-2">
                {formatDistanceToNow(eventDate, { addSuffix: true })}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted mt-2">
                Past Event
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="text-muted-foreground flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                <DateTimeDisplay date={event.date} />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary inline-flex w-max items-center gap-2 text-base"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>{event.address}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on Google Maps</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Organizer Info */}
              <div className="flex items-center gap-3 pt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={organizer?.image || ""} alt={organizer?.name || "Organizer"} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-muted-foreground text-sm">Organized by</p>
                  <p className="font-medium">{organizer?.name || "Event Organizer"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="mb-3 text-xl font-semibold">About this event</h3>
            <div className="prose text-muted-foreground max-w-none">
              {event.description.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex justify-between border-t pt-8">
            <Button asChild variant="outline">
              <Link href="/">Back to Events</Link>
            </Button>
            {event.user_id === session?.user?.id && (
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/events/edit/${event.id}`}>Edit Event</Link>
                </Button>
                <EventDeleteButton eventID={id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
