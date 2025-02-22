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
import { meetups } from "@/data/meetups";

export default async function Dashboard() {
  return (
    <>
      <div className="bg-background text-foreground container mx-auto p-4">
        <Button className="mb-4">
          <Link href={"/edit/new"}> Create Meetup</Link>
        </Button>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meetups.map((meetup) => (
            <Card key={meetup.id}>
              <CardHeader>
                <CardTitle>{meetup.title}</CardTitle>
                <CardDescription>
                  {meetup.date} - {meetup.address}
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
    </>
  );
}
