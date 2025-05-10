"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export default function Navbar() {
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">BlogAI</span>
            </Link>
          </div>

          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Toggle menu</span>
              </Button>

              {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 md:hidden">
                  <nav className="flex flex-col space-y-4">
                    <Link
                      href="#features"
                      className="text-slate-600 hover:text-slate-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      href="#pricing"
                      className="text-slate-600 hover:text-slate-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      href="#testimonials"
                      className="text-slate-600 hover:text-slate-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Testimonials
                    </Link>
                    <Link
                      href="#blog"
                      className="text-slate-600 hover:text-slate-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    <div className="pt-2">
                      <Link href="/login" className="w-full">
                        <Button className="w-full" variant="outline">
                          Log In
                        </Button>
                      </Link>
                    </div>
                    <div>
                      <Link href="/signup" className="w-full">
                        <Button className="w-full bg-black text-white hover:bg-slate-800">Sign Up</Button>
                      </Link>
                    </div>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="#features" className="text-slate-600 hover:text-slate-900">
                  Features
                </Link>
                <Link href="#pricing" className="text-slate-600 hover:text-slate-900">
                  Pricing
                </Link>
                <Link href="#testimonials" className="text-slate-600 hover:text-slate-900">
                  Testimonials
                </Link>
                <Link href="#blog" className="text-slate-600 hover:text-slate-900">
                  Blog
                </Link>
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-black text-white hover:bg-slate-800">Sign Up</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
