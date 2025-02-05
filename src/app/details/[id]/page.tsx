"use client";

import { use, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { type Meetup, meetups } from "../../../data/meetups";

export default function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();
  const [meetup, setMeetup] = useState<Meetup | null>(null);

  useEffect(() => {
    const foundMeetup = meetups.find((m) => m.id === id);
    if (foundMeetup) {
      setMeetup(foundMeetup);
    } else {
      router.push("/dashboard");
    }
  }, [router, id]);

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
    <div className="bg-background text-foreground container mx-auto p-4">
      <Navbar />
      <Card>
        <CardHeader>
          <CardTitle>{meetup.title}</CardTitle>
          <CardDescription>
            {meetup.date} - {meetup.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meetup.banner && (
            <div className="mb-4">
              <Image
                src={meetup.banner || "/placeholder.svg"}
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
