import Link from "next/link";
import Image from "next/image";
import { Category } from "@/interfaces/productinterface";

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`);
  const data = await res.json();
  return data.data as Category[];
}

export default async function CategorySection() {
  const categories = await getCategories();

  return (
    <section className="py-16">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
        <Link href="/categories" className="text-sm font-medium text-black hover:underline">
          View all categories &rarr;
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {categories.slice(0, 6).map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className="group relative flex flex-col items-center gap-3 transition-all"
          >
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted transition-all group-hover:border-black group-hover:shadow-lg lg:h-40 lg:w-40">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-center font-semibold transition-colors group-hover:text-black">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
