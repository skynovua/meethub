import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

import { meetups } from "../../data/meetups";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            Logout
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
      <Button className="mb-4">
        <Link href={"/edit/new"}> Create Meetup</Link>
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetups.map((meetup) => (
          <Card key={meetup.id}>
            <CardHeader>
              <CardTitle>{meetup.title}</CardTitle>
              <CardDescription>
                {meetup.date} - {meetup.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{meetup.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/details/${meetup.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
