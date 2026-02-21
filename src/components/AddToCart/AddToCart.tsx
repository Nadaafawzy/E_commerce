"use client"
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import toast from "react-hot-toast";
import { addToCartAction } from "@/actions/addToCart.action";
import WishlistButton from "../Wishlist/WishlistButton";
import { useSession } from "next-auth/react";

export default function AddToCart({productsId}: {productsId:string}) {
    const { data: session } = useSession();
    const token = session?.token;

    async function addToCart(productsId: string) {
        if (!token) {
            toast.error("Please login to add products to cart");
            return;
        }
        const data = await addToCartAction(productsId, token)
        toast.success(data.message);
    }
  return <>
  <CardFooter className="gap-2">
   <Button onClick={()=> addToCart(productsId)}className="px-9 py-6 me-1 rounded-full">Add to cart</Button>
   <WishlistButton productId={productsId} />
  </CardFooter>
  </>
}
