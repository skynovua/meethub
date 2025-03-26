"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { EventCategory } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createEvent, updateEvent } from "@/actions/event";
import { EventFormFields } from "@/components/event-form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { EventFormData, EventFormSchema } from "@/lib/schemas";

const defaultValues: EventFormData = {
  title: "",
  description: "",
  date: "",
  address: "",
  banner: "",
  category: EventCategory.OTHER,
  has_tickets: false,
  price: null,
};

interface EditMeetupProps {
  event: (EventFormData & { id: string }) | null;
}

export function EventForm({ event }: EditMeetupProps) {
  const router = useRouter();
  const form = useForm<EventFormData>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: event || defaultValues,
  });

  const previewImage = form.watch("banner");

  const onSubmit = async (values: EventFormData) => {
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
    <Card>
      <CardHeader>
        <CardTitle>{event ? "Edit Meetup" : "Create Meetup"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <EventFormFields />
            <Button className="mt-4 w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? "Update Meetup" : "Create Meetup"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
