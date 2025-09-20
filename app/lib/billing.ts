"use client";

import { loadStripe, Stripe } from "@stripe/stripe-js";
import { BillingInterval, CheckoutSessionPayload, createCheckoutSession } from "./api";
import { trackEvent } from "./analytics";

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");
  }
  return stripePromise;
}

export async function startCheckout(plan: string, interval: BillingInterval): Promise<void> {
  const payload: CheckoutSessionPayload = { plan, interval };
  const response = await createCheckoutSession(payload);
  trackEvent("checkout_started", { plan, interval });

  const stripe = await getStripe();
  if (stripe && response.sessionId) {
    const { error } = await stripe.redirectToCheckout({ sessionId: response.sessionId });
    if (!error) {
      return;
    }
    console.warn("Stripe redirect failed", error);
  }

  if (response.url) {
    window.location.href = response.url;
  }
}
