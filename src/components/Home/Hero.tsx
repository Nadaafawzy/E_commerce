import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-zinc-50 border border-zinc-200 md:h-[600px]">
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-black/5 blur-3xl transition-transform duration-700 hover:scale-110" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-black/5 blur-3xl transition-transform duration-700 hover:scale-110" />
      
      <div className="container relative flex h-full flex-col items-center justify-center px-8 text-center md:px-16">
        <div className="max-w-3xl animate-in fade-in zoom-in duration-700">
          <span className="mb-4 inline-block rounded-full bg-zinc-200 px-4 py-1 text-sm font-medium text-zinc-800">
            New Collection 2026
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-black md:text-6xl lg:text-7xl">
            Best Choice <br />
            <span className="text-zinc-500">For you</span>
          </h1>
          <p className="mb-8 text-lg text-zinc-600 md:text-xl max-w-2xl mx-auto">
            Experience the next generation of e-commerce with our curated selection of premium products. Quality, style, and innovation delivered to your door.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-black text-white hover:bg-zinc-800">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-black text-black hover:bg-black/5">
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
