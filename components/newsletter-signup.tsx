"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your newsletter service
    setIsSubmitted(true)
  }

  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
      <p className="text-xl text-slate-300 mb-8">
        Subscribe to our newsletter for the latest AI content generation tips and updates
      </p>

      {isSubmitted ? (
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Thank you for subscribing!</h3>
          <p className="text-slate-300">
            We've sent a confirmation email to your inbox. Please check your email to complete the subscription.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <Button type="submit" className="bg-white text-black hover:bg-slate-200 px-6">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  )
}
