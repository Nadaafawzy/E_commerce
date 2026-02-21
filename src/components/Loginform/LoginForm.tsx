"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
 email: z.email('invalid email').nonempty('email is required'),
    
  password: z.string().nonempty('password is required'),
})

export default function LoginForm() {
  const [loading,setLoading]=useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
     password: "",
    },
  })
  
const router=useRouter()
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        callbackUrl: redirect?redirect:'/products',
        redirect: true,
      })

      console.log("SignIn response:", response)

      if (response?.ok) {
        toast.success('Login success')
        router.push('/products')
      } else {
        const errorMessage = response?.error === "CredentialsSignin" 
          ? "Invalid email or password" 
          : (response?.error || "Login failed");
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Login onSubmit error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-email">
                    email
                  </FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="form-rhf-demo-email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-password">
                    password
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="form-rhf-demo-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button  disabled={loading} type="submit" form="form-rhf-demo">
            {loading &&<Loader2 className="animate-spin"/>}
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
