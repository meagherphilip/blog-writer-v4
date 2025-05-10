import Link from "next/link"
import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | BlogAI",
  description: "Login to your BlogAI account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-2xl font-bold">BlogAI</span>
          </Link>
          <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Log in to your account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">We'll send you a magic link to your email</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-8">
            <LoginForm />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-black hover:text-gray-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
