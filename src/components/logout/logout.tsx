'use client'
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function logout() {
  return<>
  <DropdownMenuItem onClick={()=>signOut({
        callbackUrl:'/'
      })}>Log Out</DropdownMenuItem>
  </>
}
