"use client";

import { use, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "../../../contexts/AuthContext";
import { type Meetup, meetups } from "../../../data/meetups";

export default function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { user } = useAuth();
  const router = useRouter();
  const [meetup, setMeetup] = useState<Meetup | null>(null);

  useEffect(() => {
    if (!user) {
      const foundMeetup = meetups.find((m) => m.id === id);
      if (foundMeetup) {
        setMeetup(foundMeetup);
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router, id]);

  const handleEdit = () => {
    router.push(`/edit/${meetup?.id}`);
  };

  const handleCancel = () => {
    // In a real app, you'd want to make an API call here
    alert("Meetup cancelled");
    router.push("/dashboard");
  };

  if (!meetup) return null;

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <Card>
        <CardHeader>
          <CardTitle>{meetup.title}</CardTitle>
          <CardDescription>
            {meetup.date} - {meetup.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meetup.bannerImage && (
            <div className="mb-4">
              <Image
                src={meetup.bannerImage || "/placeholder.svg"}
                alt={meetup.title}
                width={400}
                height={200}
              />
            </div>
          )}
          <p>{meetup.description}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleEdit} className="mr-2">
            Edit
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            Cancel Meetup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
