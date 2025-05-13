import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import ClientTableWrapper from './client-table-wrapper'

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  // Protect: Only allow admin
  if (!user || user.app_metadata?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg mb-6">Welcome, admin! You have access to this protected section.</p>
      <ClientTableWrapper />
    </div>
  )
} 