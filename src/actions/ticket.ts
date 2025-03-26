"use server";

import { AuthError } from "next-auth";

import { auth } from "@/core/auth";
import { db } from "@/core/prisma";
import { stripe } from "@/core/stripe";
import { TicketPurchaseData, TicketPurchaseSchema } from "@/lib/schemas";

import { getUserByEmail } from "./user";

/**
 * Ініціює процес покупки квитка на подію
 */
export async function createCheckoutSession(data: TicketPurchaseData) {
  try {
    // Валідація даних
    const validatedData = TicketPurchaseSchema.safeParse(data);
    if (!validatedData.success) {
      throw new Error("Invalid data");
    }

    const { eventId, quantity } = validatedData.data;

    // Перевірка на аутентифікацію користувача
    const session = await auth();
    if (!session?.user?.email) {
      throw new AuthError("You must be signed in to purchase tickets");
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      throw new Error("User not found");
    }

    // Отримання деталей про івент
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (!event.has_tickets) {
      throw new Error("This event does not offer tickets");
    }

    if (!event.price) {
      throw new Error("Invalid ticket price");
    }

    // Створення запису про квиток у базі даних
    const ticket = await db.ticket.create({
      data: {
        event_id: eventId,
        user_id: user.id,
        quantity,
      },
    });

    // Формування URL для успішного/неуспішного завершення
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tickets/success?ticket_id=${ticket.id}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`;

    // Створення Stripe Checkout сесії
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.title,
              description: `Ticket for ${event.title}`,
              images: [event.banner],
            },
            unit_amount: Math.round(event.price * 100), // Stripe приймає суму в центах
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        eventId,
        ticketId: ticket.id,
        userId: user.id,
      },
    });

    // Зберігання ID Stripe сесії у записі про платіж
    await db.payment.create({
      data: {
        user_id: user.id,
        ticket_id: ticket.id,
        amount: event.price * quantity,
        stripe_checkout_id: stripeSession.id,
      },
    });

    // Повернення URL для перенаправлення на Stripe Checkout
    return { sessionUrl: stripeSession.url };
  } catch (error) {
    console.error("Checkout session creation error:", error);
    throw error;
  }
}

/**
 * Отримання квитка за ID
 */
export async function getTicketById(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new AuthError("You must be signed in to view ticket details");
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    throw new Error("User not found");
  }

  const ticket = await db.ticket.findUnique({
    where: {
      id,
    },
    include: {
      event: true,
      payment: true,
    },
  });

  // Перевірка, чи квиток належить поточному користувачу
  if (!ticket || ticket.user_id !== user.id) {
    throw new Error("Ticket not found");
  }

  return ticket;
}

/**
 * Отримання всіх квитків користувача
 */
export async function getUserTickets() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new AuthError("You must be signed in to view your tickets");
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    throw new Error("User not found");
  }

  const tickets = await db.ticket.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      event: true,
      payment: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return tickets;
}

/**
 * Підтвердження оплати квитка (використовується при успішному поверненні з Stripe)
 */
export async function confirmTicketPayment(ticketId: string, stripeSessionId: string) {
  try {
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: { payment: true },
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const payment = ticket.payment;
    if (!payment || payment.stripe_checkout_id !== stripeSessionId) {
      throw new Error("Invalid payment information");
    }

    // Отримання сесії Stripe для підтвердження оплати
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);

    if (stripeSession.payment_status === "paid") {
      // Оновлення статусу квитка і платежу
      await db.ticket.update({
        where: { id: ticketId },
        data: { status: "PAID" },
      });

      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          stripe_payment_id: stripeSession.payment_intent as string,
        },
      });

      // revalidatePath("/profile");
      return { success: true };
    } else {
      return { success: false, message: "Payment not completed" };
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    throw error;
  }
}
