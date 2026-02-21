import Link from "next/link";
import { Facebook, Instagram, Twitter, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-black py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tighter text-white">ShopMark</h2>
            <p className="max-w-[200px] text-sm text-zinc-400">
              The best choice for your digital style. Curated premium products delivered with care.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Facebook className="size-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Instagram className="size-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-white transition-colors">
                <Twitter className="size-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Shop</h3>
            <nav className="flex flex-col gap-2 text-sm text-zinc-400">
              <Link href="/products" className="hover:text-white transition-colors">All Products</Link>
              <Link href="/brands" className="hover:text-white transition-colors">Featured Brands</Link>
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link>
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Support</h3>
            <nav className="flex flex-col gap-2 text-sm text-zinc-400">
              <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
              <Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link>
              <Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Get in Touch</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MessageSquare className="size-4" />
                <span>support@shopmark.com</span>
              </div>
              <p className="text-xs text-zinc-500">
                Sign up for our newsletter to get updates on new products and special offers.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 focus:outline-none"
                />
                <button className="rounded-md bg-white px-4 py-2 text-xs font-medium text-black hover:bg-zinc-200 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900 pt-8 text-center text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} ShopMark Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
