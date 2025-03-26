import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { confirmTicketPayment, getTicketById } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TicketSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket_id?: string; session_id?: string }>;
}) {
  // Await searchParams before accessing its properties
  const params = await searchParams;
  const { ticket_id, session_id } = params;

  // Якщо немає ідентифікатора квитка або сесії, перенаправляємо на головну сторінку
  if (!ticket_id || !session_id) {
    redirect("/");
  }

  try {
    // Підтверджуємо оплату квитка
    await confirmTicketPayment(ticket_id, session_id);
    const ticket = await getTicketById(ticket_id);

    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center p-4">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="text-primary mb-2 h-12 w-12" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your ticket purchase for &quot;{ticket.event.title}&quot; has been confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Event</p>
                  <p className="font-medium">{ticket.event.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Date</p>
                  <p className="font-medium">{new Date(ticket.event.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Quantity</p>
                  <p className="font-medium">{ticket.quantity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Total Paid</p>
                  <p className="font-medium">${(ticket.payment?.amount || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/profile?tab=tickets">View My Tickets</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error confirming ticket payment:", error);
    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center p-4">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Payment Verification Error</CardTitle>
            <CardDescription>
              We couldn&apos;t verify your payment. If you believe this is an error, please contact
              support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild>
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
