import Link from "next/link"
import type { Metadata } from "next"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Verify | BlogAI",
  description: "Verify your email address",
}

export default function VerifyPage() {
  // In a real implementation, you would verify the token from the URL
  // and handle the authentication process here

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-2xl font-bold">BlogAI</span>
          </Link>
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Verifying your email</h1>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              {/* This would be conditionally rendered based on verification state */}
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Successfully verified!</h2>
              <p className="text-muted-foreground">Your email has been verified. You are now logged in.</p>
              <Button asChild className="mt-4 bg-black text-white hover:bg-slate-800">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>

              {/* Loading state (would be shown while verifying) */}
              {/* 
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <h2 className="text-xl font-semibold">Verifying your email</h2>
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
              */}

              {/* Error state (would be shown if verification fails) */}
              {/*
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Verification failed</h2>
              <p className="text-muted-foreground">
                The verification link is invalid or has expired.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/login">Back to Login</Link>
              </Button>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
