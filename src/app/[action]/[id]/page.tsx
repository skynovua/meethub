"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Meetup, meetups } from "@/data/meetups";

const meetupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  address: z.string().min(1, "address is required"),
  banner: z.string().optional(),
});

export default function CreateEditMeetup({ params }: { params: { action: string; id?: string } }) {
  const router = useRouter();
  const [meetup, setMeetup] = useState<Meetup>({
    id: "",
    title: "",
    description: "",
    date: "",
    address: "",
    organizerId: "",
    banner: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const foundMeetup = meetups.find((m) => m.id === params.id);
    if (foundMeetup) {
      setMeetup(foundMeetup);
    } else {
      router.push("/dashboard");
    }
  }, [router, params.action, params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      meetupSchema.parse(meetup);
      // In a real app, you'd make an API call here
      alert(params.action === "create" ? "Meetup created" : "Meetup updated");
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeetup((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{params.action === "create" ? "Create Meetup" : "Edit Meetup"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={meetup.title} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={meetup.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={meetup.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">address</Label>
                <Input
                  id="address"
                  name="address"
                  value={meetup.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="banner">Banner Image URL</Label>
                <Input
                  id="banner"
                  name="banner"
                  value={meetup.banner}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <Button className="mt-4 w-full" type="submit">
              {params.action === "create" ? "Create Meetup" : "Update Meetup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
