"use server"

export async function updateCartCountAction(productId: string, count: number, token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ count: count }),
    headers: {
      token: token,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return data;
}
