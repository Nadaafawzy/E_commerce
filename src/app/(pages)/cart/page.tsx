"use client"
import { getCartAction } from "@/actions/getCart.action";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { CartRes } from "@/interfaces/cartinterfaces";
import CartItem from "@/components/Cart/CartItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CheckOutSession from "@/components/checkOutSession/checkOutSession";

export default function CartPage() {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartRes | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!session?.token) return;
    try {
      const data = await getCartAction(session.token);
      if (data.status === "success") {
        setCart(data);
      } else if (data.message === "No cart found for this user") {
        setCart(null);
      }
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    if (session?.token) {
      fetchCart();
    } else if (session === null) {
        setLoading(false);
    }
  }, [session, fetchCart]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-gray-500 animate-pulse">Loading your shopping bag...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Shopping Bag</h1>
        <p className="text-gray-600 mb-8 text-lg">Please sign in to view your cart items.</p>
        <Link href="/login">
          <Button size="lg" className="rounded-full px-10">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (!cart || cart.numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto border-2 border-dashed border-gray-200">
          <ShoppingBag className="size-16 mx-auto text-gray-400 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Your Bag is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any quality items to your bag yet.</p>
          <Link href="/products">
            <Button size="lg" className="rounded-full px-10 w-full">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <h1 className="text-3xl font-bold">Shopping Bag</h1>
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold">
              {cart.numOfCartItems} Items
            </span>
          </div>
          
          <div className="space-y-2 bg-white rounded-xl shadow-sm border overflow-hidden">
            {cart.data.products.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                token={session.token!}
                onUpdate={fetchCart}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-primary sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{cart.data.totalCartPrice} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">{cart.data.totalCartPrice} EGP</span>
              </div>
            </div>

            <CheckOutSession cartId={cart.data._id}/>
            
            <p className="text-center text-xs text-gray-400 mt-6">
              Tax included. Shipping and discounts calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
