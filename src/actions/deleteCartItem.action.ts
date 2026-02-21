"use server"

export async function deleteCartItemAction(productId: string, token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${productId}`, {
    method: "DELETE",
    headers: {
      token: token,
    }
  });
  const data = await response.json();
  return data;
}
