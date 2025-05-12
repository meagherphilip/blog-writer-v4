"use client"
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import React from 'react'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const session = useSession()

  // Upsert profile after login if pendingProfileName exists
  useEffect(() => {
    if (session && session.user) {
      const pendingName = typeof window !== 'undefined' ? localStorage.getItem('pendingProfileName') : null;
      if (pendingName) {
        supabaseClient.from('user_profiles').upsert({
          user_id: session.user.id,
          name: pendingName,
          language: 'en',
          timezone: 'utc',
          avatar_url: ''
        }).then(() => {
          localStorage.removeItem('pendingProfileName');
        });
      }
    }
  }, [session, supabaseClient]);

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
} 