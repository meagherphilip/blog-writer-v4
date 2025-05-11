"use client"
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  const firstRender = useRef(true)

  useEffect(() => {
    // Skip redirect on first render to allow Supabase to hydrate session
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (session === null) {
      router.replace('/login')
    }
  }, [session, router])

  if (session === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return <>{children}</>
} 