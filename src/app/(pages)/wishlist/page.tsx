"use client";
import { useWishlist } from "@/components/Wishlist/WishlistContext";
import { Products } from "@/interfaces/productinterface";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, StarHalf, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddToCart from "@/components/AddToCart/AddToCart";

import { useSession } from "next-auth/react";

export default function WishlistPage() {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const token = session?.token;

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`, {
          headers: { token },
        });
        const data = await res.json();
        
        if (data.status === "success" && data.data) {
          setProducts(data.data as Products[]);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWishlistProducts();
  }, [wishlistIds, token]);

  const handleRemove = async (productId: string) => {
    // Optimistic update for the local state
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    await removeFromWishlist(productId);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-zinc-100" />
          <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-black" />
        </div>
        <p className="animate-pulse text-sm font-medium tracking-widest text-zinc-500 uppercase">
          Loading wishlist...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100">
          <Heart className="size-12 text-zinc-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start adding items you love by clicking the heart icon on any
            product.
          </p>
        </div>
        <Link href="/products">
          <Button className="mt-2 rounded-full px-8 py-6 text-base">
            <ShoppingBag className="mr-2 size-5" />
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-black hover:underline"
        >
          Continue Shopping &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="group transition-all hover:-translate-y-1"
          >
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
                  <CardDescription className="text-xs uppercase tracking-wider">
                    {product.brand.name}
                  </CardDescription>
                  <CardTitle className="line-clamp-1 text-base">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="size-3 fill-current" />
                      ))}
                      <StarHalf className="size-3 fill-current" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {product.ratingsAverage}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {product.price} EGP
                  </p>
                </CardContent>
              </Link>

              <CardFooter className="flex items-center gap-2 p-4 pt-0">
                <AddToCart productsId={product._id} />
              </CardFooter>

              <div className="px-4 pb-4">
                <button
                  onClick={() => handleRemove(product._id)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="size-4" />
                  Remove from Wishlist
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
