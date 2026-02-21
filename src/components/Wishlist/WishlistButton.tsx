"use client";
import { Heart } from "lucide-react";
import { useWishlist } from "./WishlistContext";
import { useState } from "react";

export default function WishlistButton({ productId }: { productId: string }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  const liked = isInWishlist(productId);

  async function handleToggle() {
    setIsAnimating(true);
    if (liked) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
    setTimeout(() => setIsAnimating(false), 300);
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      className="group/heart cursor-pointer rounded-full p-2 transition-all duration-200 hover:bg-red-50"
    >
      <Heart
        className={`size-6 transition-all duration-300 ${
          liked
            ? "fill-red-500 text-red-500"
            : "fill-none text-gray-400 group-hover/heart:text-red-400"
        } ${isAnimating ? "scale-125" : "scale-100"}`}
      />
    </button>
  );
}
