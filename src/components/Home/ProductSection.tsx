import Link from "next/link";
import Image from "next/image";
import { Star, StarHalf } from "lucide-react";
import { Products, ProductsResponse } from "@/interfaces/productinterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddToCart from "@/components/AddToCart/AddToCart";

async function getFeaturedProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products?limit=8`);
  const data: ProductsResponse = await res.json();
  return data.data;
}

export default async function ProductSection() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground">Our handpicked selection of premium items.</p>
        </div>
        <Link href="/products" className="text-sm font-medium text-black hover:underline">
          Browse all products &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product._id} className="group transition-all hover:-translate-y-1">
            <Card className="overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md">
              <Link href={`/products/${product._id}`}>
                <div className="relative aspect-4/5 overflow-hidden bg-muted">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-xs uppercase tracking-wider">{product.brand.name}</CardDescription>
                  <CardTitle className="line-clamp-1 text-base">{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="size-3 fill-current" />
                      ))}
                      <StarHalf className="size-3 fill-current" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{product.ratingsAverage}</span>
                  </div>
                  <p className="text-lg font-bold text-primary">{product.price} EGP</p>
                </CardContent>
              </Link>
              <div className="p-4 pt-0">
                <AddToCart productsId={product._id} />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
