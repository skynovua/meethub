import { TicketStatus } from "@prisma/client";
import { Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DateTimeDisplay } from "@/components/date-time-display";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TicketCardProps {
  ticket: {
    id: string;
    event_id: string;
    user_id: string;
    quantity: number;
    status: TicketStatus;
    created_at: Date;
    updated_at: Date;
    event: {
      id: string;
      title: string;
      description: string;
      date: Date;
      banner: string;
      address: string;
    };
    payment: {
      id: string;
      amount: number;
      status: string;
    } | null;
  };
}

export function TicketCard({ ticket }: TicketCardProps) {
  const event = ticket.event;
  const isPastEvent = new Date(event.date) < new Date();
  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="flex">
        {/* Event Image */}
        <Link href={`/events/${event.id}`} className="relative block h-36 w-1/3">
          <div className="relative h-full w-full overflow-hidden">
            {isPastEvent && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                <span className="rounded-md bg-red-500 px-1 py-0.5 text-[10px] font-bold text-white">
                  Past
                </span>
              </div>
            )}
            <Image
              src={event.banner}
              alt={event.title}
              fill
              className={"scale-100 object-cover transition-all duration-200"}
              sizes="(max-width: 768px) 100%, 33vw"
            />
          </div>
        </Link>

        {/* Ticket Info */}
        <div className="flex flex-1 flex-col p-3">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                <DateTimeDisplay date={event.date} />
              </div>
              <div className={`rounded-full px-2 py-0.5 text-xs ${statusColor[ticket.status]}`}>
                {ticket.status === "PENDING"
                  ? "Pending"
                  : ticket.status === "PAID"
                    ? "Confirmed"
                    : "Cancelled"}
              </div>
            </div>
            <Link href={`/events/${event.id}`}>
              <CardTitle className="mt-1 line-clamp-1 text-base font-semibold">
                {event.title}
              </CardTitle>
            </Link>
          </CardHeader>

          <CardContent className="p-0 py-1">
            <CardDescription className="line-clamp-1 flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              {event.address}
            </CardDescription>
          </CardContent>

          <CardFooter className="mt-auto flex items-center justify-between p-0 pt-2">
            <div className="flex items-center gap-1 text-xs">
              <TicketIcon className="h-3 w-3" />
              <span>
                {ticket.quantity} {ticket.quantity === 1 ? "ticket" : "tickets"}
              </span>
            </div>
            <div className="text-sm font-medium">
              {ticket.payment ? `$${ticket.payment.amount.toFixed(2)}` : "Free"}
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
