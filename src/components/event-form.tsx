"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { z } from "zod";

import { createEvent } from "@/actions/event";
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
import { getImageData, toBase64 } from "@/utils/file";

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
  banner: z.any(),
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
  meet: MeetupForm;
  isUpdate: boolean;
}

export default function EventForm({ meet, isUpdate }: EditMeetupProps) {
  const [preview, setPreview] = useState("");

  const form = useForm<MeetupForm>({
    resolver: zodResolver(meetupSchema),
    defaultValues: isUpdate ? meet : defaultValues,
  });

  const onSubmit = async (values: MeetupForm) => {
    const fileBase64 = await toBase64(values.banner[0]);

    await createEvent({
      ...values,
      date: new Date(values.date),
      banner: fileBase64,
    });
  };

  return (
    <div className="bg-background text-foreground container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isUpdate ? "Edit Meetup" : "Create Meetup"}</CardTitle>
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
                          onChange={(event) => {
                            const { files, displayUrl } = getImageData(event);
                            setPreview(displayUrl);
                            onChange(files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {preview && (
                  <div className="relative h-64 w-full">
                    <Image src={preview} alt="Banner Preview" layout="fill" objectFit="cover" />
                  </div>
                )}
              </div>
              <Button className="mt-4 w-full" type="submit">
                {isUpdate ? "Update Meetup" : "Create Meetup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
