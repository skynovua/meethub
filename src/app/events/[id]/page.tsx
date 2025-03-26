import { EventCategory } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Tag, Ticket, User } from "lucide-react";
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
import { TicketPurchaseForm } from "@/components/ticket-purchase-form";
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
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { auth } from "@/core/auth";
import { cn } from "@/lib/utils";
import { getGoogleMapsUrl } from "@/utils/maps";

export const revalidate = 0;

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
  const formattedDate = formatDistanceToNow(eventDate, { addSuffix: true });

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/events" className="flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Events</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="line-clamp-1">{event.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column with main event content */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-none shadow-lg">
            {/* Banner image with overlays */}
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
                className={cn(
                  "object-cover transition-opacity duration-300",
                  !isUpcoming ? "opacity-80" : "opacity-100",
                )}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />

              {/* Category Badge */}
              <div className="absolute bottom-4 left-4">
                <CategoryBadge categoryValue={event.category || EventCategory.OTHER} />
              </div>

              {/* Action buttons */}
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
            </div>

            <CardHeader className="pb-2">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full",
                    isUpcoming
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {isUpcoming ? formattedDate : "Past Event"}
                </Badge>

                <Badge variant="outline" className="rounded-full">
                  <Tag className="mr-1 h-3 w-3" />
                  {event.category || "Other"}
                </Badge>
              </div>

              <CardTitle className="text-2xl font-bold sm:text-3xl">{event.title}</CardTitle>
            </CardHeader>

            <CardContent className="pb-6">
              <div className="mb-6 grid grid-cols-1 gap-4">
                {/* Date and location info */}
                <div className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <DateTimeDisplay date={event.date} className="text-foreground font-medium" />
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary inline-flex w-max items-center gap-2"
                        >
                          <MapPin className="h-5 w-5" />
                          <span className="text-foreground font-medium">{event.address}</span>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View on Google Maps</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Organizer Info */}
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={organizer?.image || ""}
                      alt={organizer?.name || "Organizer"}
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-muted-foreground text-sm">Organized by</p>
                    <p className="font-medium">{organizer?.name || "Event Organizer"}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Event description */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">About this event</h3>
                <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                  {event.description.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-wrap justify-between gap-4 border-t pt-6">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/events">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Events
                  </Link>
                </Button>

                {event.user_id === session?.user?.id && (
                  <div className="flex flex-wrap gap-2">
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

        {/* Right sidebar for tickets and additional info */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Ticket purchase box - only show for upcoming events */}
            {isUpcoming && event.has_tickets && event.price ? (
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="bg-muted/50 pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Ticket className="h-5 w-5" />
                    Event Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold">${event.price.toFixed(2)}</p>
                    <p className="text-muted-foreground text-sm">per ticket</p>
                  </div>

                  <div className="mt-6">
                    <TicketPurchaseForm eventId={event.id} price={event.price} />
                  </div>

                  <p className="text-muted-foreground mt-4 text-center text-xs">
                    Secure payment processing. Instant ticket delivery.
                  </p>
                </CardContent>
              </Card>
            ) : isUpcoming ? (
              <Card className="bg-muted/50 shadow-md">
                <CardContent className="p-4 text-center">
                  <p className="mb-2 font-medium">Free Event</p>
                  <p className="text-muted-foreground text-sm">No tickets required to attend.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-muted/30 shadow-md">
                <CardContent className="p-4 text-center">
                  <p className="mb-2 font-medium">Past Event</p>
                  <p className="text-muted-foreground text-sm">
                    This event has already taken place.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Social stats card */}
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-around p-4">
                <div className="text-center">
                  <p className="text-lg font-bold">{event.favoriteCount}</p>
                  <p className="text-muted-foreground text-sm">Likes</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="text-lg font-bold">{event.bookmarkCount || 0}</p>
                  <p className="text-muted-foreground text-sm">Saves</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
