'use client'
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Heart, ShoppingCart, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logout from "../logout/logout";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow py-4">
      <div className="container flex flex-col mx-auto items-start justify-between font-semibold md:flex-row md:items-center px-4 md:px-0">
        <h2 className="text-2xl font-bold">
          <Link href={'/'}>ShopMark</Link>
        </h2>
        
        <div className="flex-1 flex justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-row items-center gap-6">
          <div className="flex items-center gap-4 text-gray-700">
            <Link href="/wishlist" className="hover:text-primary transition-colors">
              <Heart className="size-6" />
            </Link>
            <Link href="/cart" className="hover:text-primary transition-colors">
              <ShoppingCart className="size-6" />
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <UserIcon className="size-6 text-gray-700 hover:text-primary transition-colors cursor-pointer" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {session ? (
                  <>
                    <Link href={'/profile'}>
                      <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    </Link>
                    <Link href={'/allorders'}>
                      <DropdownMenuItem className="cursor-pointer">My Orders</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Logout />
                  </>
                ) : (
                  <>
                    <Link href={'/login'}>
                      <DropdownMenuItem className="cursor-pointer">Login</DropdownMenuItem>
                    </Link>
                    <Link href={'/signup'}>
                      <DropdownMenuItem className="cursor-pointer">Register</DropdownMenuItem>
                    </Link>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

