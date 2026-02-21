import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes =  ['/profile', '/my-orders', '/wishlist', '/cart']
const publicRoutes = ['/login', '/signup']

export default async function middleware(req: NextRequest) {
   const token = await getToken({req})
   if(protectedRoutes.includes(req.nextUrl.pathname)){
    if(token){
        return NextResponse.next()
    }
    else{
        const redirectURL = new URL('/login', req.url)
        redirectURL.searchParams.set('redirect', req.nextUrl.pathname)
        return NextResponse.redirect(redirectURL)
    }

   }

   if(publicRoutes.includes(req.nextUrl.pathname)){
    if(token){
        const redirectURL = new URL('/',req.url)
        return NextResponse.redirect(redirectURL)
    }
    else{
        return NextResponse.next()
    }

   }
   return NextResponse.next()
}