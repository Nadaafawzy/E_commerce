"use server"

export async function getUserOrdersAction(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/user/${userId}`, {
      method: "GET",
      next: { revalidate: 0 } // Don't cache orders too aggressively
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getUserOrdersAction error:", error);
    return [];
  }
}
