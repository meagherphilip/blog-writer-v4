"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      acceptTerms: true,
    },
  })

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // For passwordless signup, use signInWithOtp (same as login)
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      // You can store the user's name after verification, e.g., in a profile table
      if (error) {
        setError(error.message)
        setIsSuccess(false)
      } else {
        setIsSuccess(true)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Account created!</p>
              <p>Check your email for a link to verify your account and log in. The link will expire in 10 minutes.</p>
            </div>
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setIsSuccess(false)
          }}
        >
          Back to sign up
        </Button>
        <Button className="w-full mt-2 bg-black text-white hover:bg-slate-800" asChild>
          <Link href="/dashboard">Go to Dashboard (Demo)</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert className="bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" placeholder="John Doe" autoComplete="name" disabled={isLoading} {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the{" "}
          <a href="/terms" className="text-black hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-black hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>
      {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}

      <Button type="submit" className="w-full bg-black text-white hover:bg-slate-800" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  )
}
