"use server"

export async function getSpecificSubcategoryAction(subcategoryId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subcategories/${subcategoryId}`, {
    method: "GET",
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data;
}
