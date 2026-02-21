"use server"

export async function getSpecificBrandAction(brandId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brands/${brandId}`, {
    method: "GET",
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data;
}
