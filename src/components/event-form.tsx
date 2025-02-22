"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { createEvent, updateEvent } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toBase64 } from "@/utils/file";

const meetupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().refine(
    (value) => {
      return !isNaN(Date.parse(value));
    },
    {
      message: "Invalid datetime format",
    },
  ),
  address: z.string().min(1, "Location is required"),
  banner: z.string().min(1, "Banner is required"),
});

type MeetupForm = z.infer<typeof meetupSchema>;

const defaultValues: MeetupForm = {
  title: "",
  description: "",
  date: "",
  address: "",
  banner: "",
};

interface EditMeetupProps {
  event: (MeetupForm & { id: string }) | null;
}

export default function EventForm({ event }: EditMeetupProps) {
  const router = useRouter();
  const form = useForm<MeetupForm>({
    resolver: zodResolver(meetupSchema),
    defaultValues: event || defaultValues,
  });

  const previewImage = form.watch("banner");

  const onSubmit = async (values: MeetupForm) => {
    try {
      if (event) {
        await updateEvent(event.id, {
          ...values,
          date: new Date(values.date),
        });
      } else {
        await createEvent({
          ...values,
          date: new Date(values.date),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{event ? "Edit Meetup" : "Create Meetup"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Banner Image URL</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          {...rest}
                          onChange={async (event) => {
                            const files = event.target.files;
                            if (!files) {
                              return;
                            }
                            const fileBase64 = await toBase64(files[0]);
                            onChange(fileBase64);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {previewImage && (
                  <div className="relative h-64 w-full">
                    <Image src={previewImage} alt="Banner Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <Button className="mt-4 w-full" type="submit" disabled={form.formState.isSubmitting}>
                {event ? "Update Meetup" : "Create Meetup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
