"use server"

export async function getSubcategoriesAction(categoryId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${categoryId}/subcategories`, {
    method: "GET",
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data;
}
