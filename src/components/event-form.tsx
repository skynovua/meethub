"use client";

import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createEvent, updateEvent } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { EventFormData, EventFormSchema } from "@/lib/schemas";

import { EventFormFields } from "./event-form-fields";

const defaultValues: EventFormData = {
  title: "",
  description: "",
  date: "",
  address: "",
  banner: "",
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
    <div className="bg-background text-foreground container mx-auto p-4">
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
    </div>
  );
}
