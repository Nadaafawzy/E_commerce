"use server"
export async function addToCartAction(productsId: string, token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`, {
    method: "POST",
    body: JSON.stringify({ productId: productsId }),
    headers: {
      token: token,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return data;
}
