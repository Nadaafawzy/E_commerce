"use server"

export async function getCartAction(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`, {
    method: "GET",
    headers: {
      token: token,
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
}
