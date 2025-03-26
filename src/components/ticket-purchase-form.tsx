"use client";

import { useState } from "react";

import { Loader2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { createCheckoutSession } from "@/actions/ticket";
import { Button } from "@/components/ui/button";
import { useAuthProtection } from "@/hooks/use-auth-protection";

interface TicketPurchaseFormProps {
  eventId: string;
  price: number;
}

export function TicketPurchaseForm({ eventId, price }: TicketPurchaseFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { withAuth } = useAuthProtection();
  const router = useRouter();

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10)); // Обмеження до 10 квитків
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1)); // Мінімум 1 квиток
  };

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const response = await createCheckoutSession({
        eventId,
        quantity,
      });

      if (response?.sessionUrl) {
        // Перенаправлення користувача на сторінку оформлення Stripe
        window.location.href = response.sessionUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
    }
  };

  // Загальна вартість квитків
  const totalPrice = (price * quantity).toFixed(2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isLoading}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="font-medium">{quantity}</span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={incrementQuantity}
            disabled={quantity >= 10 || isLoading}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-right">
          <p className="text-sm">Total:</p>
          <p className="text-lg font-semibold">${totalPrice}</p>
        </div>
      </div>

      <Button className="w-full" onClick={withAuth(handlePurchase)} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          "Buy Tickets"
        )}
      </Button>
    </div>
  );
}
