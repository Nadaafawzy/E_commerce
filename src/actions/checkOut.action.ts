"use server"

export async function createCheckoutSessionAction(cartId: string, token: string, shippingAddress: { city?: string, details?: string, phone?: string }) {
  try {
    const successUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}`;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/checkout-session/${cartId}?url=${successUrl}`, {
      method: "POST",
      body: JSON.stringify({
        shippingAddress
      }),
      headers: {
        token: token,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createCheckoutSessionAction error:", error);
    return { status: "error", message: "Failed to create checkout session" };
  }
}
