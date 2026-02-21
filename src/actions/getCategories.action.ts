"use server"

export async function getCategoriesAction() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, {
    method: "GET",
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  const data = await response.json();
  return data;
}
