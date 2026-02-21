"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

import toast from "react-hot-toast";

import { useSession } from "next-auth/react";

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
  isLoading: false,
});

export function useWishlist() {
  return useContext(WishlistContext);
}

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const token = session?.token;

  // Fetch the current wishlist on mount or when token changes
  useEffect(() => {
    async function fetchWishlist() {
      if (!token) return;
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`, {
          headers: { token },
        });
        const data = await res.json();
        if (data.data) {
          setWishlistIds(data.data.map((item: { _id: string }) => item._id));
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWishlist();
  }, [token]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }

    // Optimistic update
    setWishlistIds((prev) => [...prev, productId]);
    const toastId = toast.loading("Adding to wishlist...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`, {
        method: "POST",
        headers: {
          token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      
      if (data.status === "success") {
        setWishlistIds(data.data); // data.data is an array of IDs from the API
        toast.success("Product added to wishlist", { id: toastId });
      } else {
        // Rollback on failure
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        toast.error(data.message || "Failed to add to wishlist", { id: toastId });
      }
    } catch (err) {
      // Rollback on error
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      console.error("Failed to add to wishlist:", err);
      toast.error("An error occurred. Please try again.", { id: toastId });
    }
  }, [token]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!token) return;

    // Save previous state for rollback
    const previousIds = [...wishlistIds];
    
    // Optimistic update
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    const toastId = toast.loading("Removing from wishlist...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: { token },
      });
      const data = await res.json();
      
      if (data.status === "success") {
        setWishlistIds(data.data); // data.data is the updated array of IDs
        toast.success("Product removed from wishlist", { id: toastId });
      } else {
        // Rollback on failure
        setWishlistIds(previousIds);
        toast.error(data.message || "Failed to remove from wishlist", { id: toastId });
      }
    } catch (err) {
      // Rollback on error
      setWishlistIds(previousIds);
      console.error("Failed to remove from wishlist:", err);
      toast.error("An error occurred. Please try again.", { id: toastId });
    }
  }, [token, wishlistIds]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, addToWishlist, removeFromWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}
