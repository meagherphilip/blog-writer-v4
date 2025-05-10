"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
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
              <p className="font-medium">Magic link sent!</p>
              <p>Check your email for a link to log in. The link will expire in 10 minutes.</p>
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
          Back to login
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

      <Button type="submit" className="w-full bg-black text-white hover:bg-slate-800" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending link...
          </>
        ) : (
          "Send magic link"
        )}
      </Button>
    </form>
  )
}
