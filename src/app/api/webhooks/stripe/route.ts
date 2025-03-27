import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/core/prisma";
import { stripe } from "@/core/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const requestHeaders = await headers();
    const signature = requestHeaders.get("Stripe-Signature") as string;

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe-Signature header" }, { status: 400 });
    }

    // Верифікація, що запит дійсно надійшов від Stripe
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    // Обробка різних типів подій від Stripe
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Отримання ID квитка та користувача з метаданих сесії
        const { ticketId } = session.metadata || {};

        if (!ticketId) {
          console.error("No ticketId found in session metadata");
          return NextResponse.json({ error: "No ticket ID" }, { status: 400 });
        }

        // Отримання квитка з бази даних
        const ticket = await db.ticket.findUnique({
          where: {
            id: ticketId,
          },
          include: {
            payment: true,
          },
        });

        if (!ticket) {
          console.error(`Ticket with ID ${ticketId} not found`);
          return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // Оновлення статусу квитка і платежу
        await db.ticket.update({
          where: { id: ticketId },
          data: { status: "PAID" },
        });

        if (ticket.payment) {
          await db.payment.update({
            where: { id: ticket.payment.id },
            data: {
              status: "COMPLETED",
              stripe_payment_id: session.payment_intent as string,
            },
          });
        }

        // Оновлення UI
        revalidatePath("/profile");

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const { ticketId } = session.metadata || {};

        if (ticketId) {
          // Скасування квитка, якщо сесія checkout завершилась невдало
          const ticket = await db.ticket.findUnique({
            where: {
              id: ticketId,
            },
            include: {
              payment: true,
            },
          });

          if (ticket) {
            // Оновлюємо статус квитка на скасований
            await db.ticket.update({
              where: { id: ticketId },
              data: { status: "CANCELLED" },
            });

            // Оновлюємо статус платежу, якщо він існує
            if (ticket.payment) {
              await db.payment.update({
                where: { id: ticket.payment.id },
                data: { status: "FAILED" },
              });
            }

            revalidatePath("/profile");
          }
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
