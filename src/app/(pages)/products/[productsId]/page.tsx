
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  Heart, Star, StarHalf } from "lucide-react";
import { Products } from "@/interfaces/productinterface";
import { Params } from "next/dist/server/request/params";
import { Button } from "@/components/ui/button";
import Slider from "@/components/Slider/Slider";
import AddToCart from "@/components/AddToCart/AddToCart";

export default async function ProductDetails({params}:{params:Params}) {
  const{productsId}= await params;
  console.log(productsId);
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/`+productsId);
  const {data:product} :{data : Products} = await response.json();
  
  return <>
   <Card className="grid grid-cols-1 md:grid-cols-3 items-center">
    <div>
      <Slider images={product.images} title={product.title}/>
  
    </div>
    <div className="col-span-2 space-y-4 p-4">
      <CardHeader className="pt-5">
    <CardDescription>{product.brand.name}</CardDescription>
    <CardTitle>{product.title}</CardTitle>
    <CardAction className="font-semibold text-gray-500">{product.category.name}</CardAction>
    <CardDescription className="py-4">{product.description}</CardDescription>
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
  <AddToCart productsId={product.id}/>
    </div>
    
   </Card>
</>
}
