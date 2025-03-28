import { EventCategory } from "@prisma/client";
import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SigninPayload = z.infer<typeof SigninSchema>;

export const SignUpSchema = z
  .object({
    name: z.string().min(2),
  })
  .merge(SigninSchema);

export type SignupPayload = z.infer<typeof SignUpSchema>;

export const EventFormSchema = z.object({
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
  category: z.nativeEnum(EventCategory),
  // Нові поля для квитків
  has_tickets: z.boolean().default(false),
  price: z.number().nullable().optional(),
});

export type EventFormData = z.infer<typeof EventFormSchema>;

// Схема для створення запиту на купівлю квитка
export const TicketPurchaseSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  quantity: z.number().int().positive().default(1),
});

export type TicketPurchaseData = z.infer<typeof TicketPurchaseSchema>;
