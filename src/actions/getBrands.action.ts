"use server"

export async function getBrandsAction() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brands`, {
    method: "GET",
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data;
}
