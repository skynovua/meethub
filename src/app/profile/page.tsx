import { redirect } from "next/navigation";

import { getUserBookmarkedEvents, getUserFavoritedEvents } from "@/actions/event";
import { getUserByEmail } from "@/actions/user";
import { EventCard } from "@/components/event-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/core/auth";

export const revalidate = 0;

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/api/auth/signin");
  }

  // Get user's bookmarked and favorite events
  const bookmarkedEvents = await getUserBookmarkedEvents();
  const favoriteEvents = await getUserFavoritedEvents();

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bookmarks">
        <TabsList className="mb-4">
          <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks">
          <h2 className="mb-4 text-xl font-semibold">Saved Events</h2>
          {bookmarkedEvents.length === 0 ? (
            <p className="text-muted-foreground">You haven`t saved any events yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          <h2 className="mb-4 text-xl font-semibold">Favorite Events</h2>
          {favoriteEvents.length === 0 ? (
            <p className="text-muted-foreground">You haven`t liked any events yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoriteEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
