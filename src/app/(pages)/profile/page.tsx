"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updateUserAction } from '@/actions/updateUser.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel, Field, FieldError } from '@/components/ui/field'
import { Loader2, User, Mail, Phone, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
      })
    }
  }, [session, reset])

  async function onSubmit(data: ProfileFormValues) {
    if (!session?.token) {
        toast.error("You must be logged in to update your profile")
        return
    }
    setLoading(true)
    try {
      const res = await updateUserAction(data, session.token)
      if (res.status === "success" || res.statusMsg === "success" || res.message === "success") {
        toast.success("Profile updated successfully!")
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session.user,
            ...data
          }
        })
      } else {
        toast.error(res.message || res.statusMsg || "Failed to update profile")
        console.error("Profile update failed:", res)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error("Profile update error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 p-8 border-b border-gray-100 flex items-center gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/10">
            <User className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
            <p className="text-gray-500 text-sm">Update your profile details and contact information.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <User className="size-4 text-gray-400" />
                Full Name
              </FieldLabel>
              <Input 
                {...register('name')} 
                placeholder="Enter your full name"
                className={`rounded-xl h-12 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.name && <FieldError className="text-red-500 text-xs mt-1">{errors.name.message}</FieldError>}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Mail className="size-4 text-gray-400" />
                Email Address
              </FieldLabel>
              <Input 
                {...register('email')} 
                type="email"
                placeholder="yourname@example.com"
                className={`rounded-xl h-12 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.email && <FieldError className="text-red-500 text-xs mt-1">{errors.email.message}</FieldError>}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Phone className="size-4 text-gray-400" />
                Phone Number
              </FieldLabel>
              <Input 
                {...register('phone')} 
                placeholder="01xxxxxxxxx"
                className={`rounded-xl h-12 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.phone && <FieldError className="text-red-500 text-xs mt-1">{errors.phone.message}</FieldError>}
            </Field>
          </FieldGroup>

          <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="size-4" />
              Your data is secured
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-8 py-6 rounded-xl font-bold text-base min-w-[160px]"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        Member since {new Date().getFullYear()} • Secure Profile Management
      </div>
    </div>
  )
}
