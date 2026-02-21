"use client"
import { ArrowRight, Loader2, MapPin, Phone } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { createCheckoutSessionAction } from "@/actions/checkOut.action";
import toast from "react-hot-toast";


export default function CheckOutSession({cartId}: {cartId:string}) {
const { data: session } = useSession();
const [loading, setLoading] = useState(false);
const city =useRef<null | HTMLInputElement>(null);
const details =useRef<null | HTMLInputElement>(null);
const phone =useRef<null | HTMLInputElement>(null);

async function checkOut(){
    if (!session?.token) {
        toast.error("Please login to proceed with checkout");
        return;
    }

    const shippingAddress ={
        city:city.current?.value,
        details:details.current?.value,
        phone:phone.current?.value,
    }

    setLoading(true);
    try {
        const res = await createCheckoutSessionAction(cartId, session.token, shippingAddress);
        if (res.status === "success" && res.session?.url) {
            toast.success("Redirecting to payment...");
            window.location.href = res.session.url;
        } else {
            toast.error(res.message || "Failed to create checkout session");
            console.error("Checkout session error:", res);
        }
    } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Checkout error:", error);
    } finally {
        setLoading(false);
    }
}
  return<>
            <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full py-7 rounded-xl text-lg font-bold flex items-center justify-center gap-2 group">
              Checkout Now
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <MapPin className="size-6 text-primary" />
                Shipping Address
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Please enter your delivery details to complete the purchase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-5">
            <FieldGroup className="space-y-4">
                <Field>
                <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="city" className="text-sm font-bold text-gray-700">City</Label>
                </div>
                <Input 
                    id="city" 
                    ref={city} 
                    name="city" 
                    placeholder="e.g. Cairo"
                    className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary" 
                />
                </Field>

                <Field>
                <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="details" className="text-sm font-bold text-gray-700">Detailed Address</Label>
                </div>
                <Input 
                    id="details" 
                    ref={details} 
                    name="details" 
                    placeholder="Street name, Building, Apartment"
                    className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary" 
                />
                </Field>

                <Field>
                <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="phone" className="text-sm font-bold text-gray-700">Phone Number</Label>
                    <Phone className="size-3 text-gray-400" />
                </div>
                <Input 
                    id="phone" 
                    ref={phone} 
                    name="phone" 
                    placeholder="01xxxxxxxxx"
                    className="h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary" 
                />
                </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="flex gap-3 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl flex-1 sm:flex-none">Cancel</Button>
            </DialogClose>
            <Button 
                onClick={checkOut} 
                disabled={loading}
                className="rounded-xl flex-1 sm:flex-none px-8 py-2 font-bold"
            >
                {loading ? (
                    <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Processing...
                    </>
                ) : (
                    'Proceed to Payment'
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
}
