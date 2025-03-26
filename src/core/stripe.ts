import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

// Ініціалізація Stripe для серверної частини
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

// Функція для завантаження Stripe на клієнті
export const getStripeClient = async () => {
  return await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};
