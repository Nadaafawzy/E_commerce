"use client"
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { CartItem as CartItemType } from "@/interfaces/cartinterfaces";
import { updateCartCountAction } from "@/actions/updateCartCount.action";
import { deleteCartItemAction } from "@/actions/deleteCartItem.action";
import toast from "react-hot-toast";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  token: string;
  onUpdate: () => void;
}

export default function CartItem({ item, token, onUpdate }: CartItemProps) {
  const [loading, setLoading] = useState(false);

  async function updateCount(newCount: number) {
    if (newCount < 1) return;
    setLoading(true);
    try {
      const res = await updateCartCountAction(item.product._id, newCount, token);
      if (res.status === "success") {
        onUpdate();
      } else {
        toast.error(res.message || "Failed to update quantity");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem() {
    setLoading(true);
    try {
      const res = await deleteCartItemAction(item.product._id, token);
      if (res.status === "success") {
        toast.success("Item removed from cart");
        onUpdate();
      } else {
        toast.error(res.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 overflow-hidden rounded-md border">
          <Image
            src={item.product.imageCover}
            alt={item.product.title}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{item.product.title}</h3>
          <p className="text-gray-500 text-sm">{item.product.brand.name} | {item.product.category.name}</p>
          <p className="font-bold text-primary mt-1">{item.price} EGP</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center border rounded-lg bg-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateCount(item.count - 1)}
            disabled={loading || item.count <= 1}
            className="h-8 w-8 rounded-none border-r"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center font-medium">{item.count}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateCount(item.count + 1)}
            disabled={loading}
            className="h-8 w-8 rounded-none border-l"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={removeItem}
          disabled={loading}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="size-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
}
