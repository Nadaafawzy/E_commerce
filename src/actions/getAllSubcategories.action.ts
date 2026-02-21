"use server"

export async function getAllSubcategoriesAction() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subcategories`, {
    method: "GET",
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data;
}
