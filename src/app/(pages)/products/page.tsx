import AddToCart from "@/components/AddToCart/AddToCart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Products, ProductsResponse } from "@/interfaces/productinterface";
import { Heart, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function productspage() {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/products");
  const data: ProductsResponse = await response.json();

  return<>
  <h1>products</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
  {data.data.map((product:Products)=>{
      return(
        <div key={product._id} className="p-2">
         <Card className="overflow-hidden">
          <Link href={`/products/${product._id}`}>
          
           <div className="-m-4 -mt-7">
          <Image src={product.imageCover} alt={product.title} width={200} height={150} className="w-full object-cover"/>
          </div>
  <CardHeader className="pt-5">
    <CardDescription>{product.brand.name}</CardDescription>
    <CardTitle className="line-clamp-1">{product.title}</CardTitle>
    <CardDescription>{product.category.name}</CardDescription>
  </CardHeader>
  <CardContent className="flex gap-2 ">
    <div className="flex justify-center items-center">
      <Star className="text-yellow-500 fill-amber-500" fill="true"/>
      <Star className="text-yellow-500 fill-amber-500" fill="true"/>
      <Star className="text-yellow-500 fill-amber-500" fill="true"/>
      <Star className="text-yellow-500 fill-amber-500" fill="true"/>
      <StarHalf className="text-yellow-500 fill-amber-500" fill="true"/>
   </div>
    <p className="font-bold border border-gray-500 rounded-full p-1 ">{product.ratingsAverage}</p>
     <p className=" flex justify- center items-center font-bold ps-1">{product.price} EGP</p>
 
    
  </CardContent>
  </Link>
         
  <AddToCart productsId={product.id}/>
</Card>
        </div>
      )
    })}

  </div>
  </>
}
