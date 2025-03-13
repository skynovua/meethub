import Link from "next/link";
import { redirect } from "next/navigation";

import { getUserBookmarkedEvents, getUserFavoritedEvents } from "@/actions/event";
import { getUserByEmail } from "@/actions/user";
import { EventCard } from "@/components/event-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/core/auth";

export const revalidate = 0;

// metadate for profile page
export async function generateMetadata() {
  const session = await auth();

  if (!session?.user?.email) {
    return {
      title: "Profile | MeetHub",
      description: "View your profile and manage your events and bookmarks.",
    };
  }

  const user = await getUserByEmail(session.user.email);

  return {
    title: `${user?.name} | MeetHub`,
    description: "View your profile and manage your events and bookmarks.",
  };
}

export default async function ProfilePage({ searchParams }: { searchParams: { tab?: string } }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/sign-in");
  }

  // Get user's bookmarked and favorite events
  const bookmarkedEvents = await getUserBookmarkedEvents();
  const favoriteEvents = await getUserFavoritedEvents();

  // Get active tab from searchParams or default to "bookmarks"
  const activeTab = searchParams.tab === "favorites" ? "favorites" : "bookmarks";

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

      <Tabs defaultValue={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="bookmarks" asChild>
            <Link href="?tab=bookmarks">My Bookmarks</Link>
          </TabsTrigger>
          <TabsTrigger value="favorites" asChild>
            <Link href="?tab=favorites">My Favorites</Link>
          </TabsTrigger>
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
