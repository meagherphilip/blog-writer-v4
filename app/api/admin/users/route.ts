import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // 1. Use cookies() synchronously in app/api
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Use service role to fetch all users, profiles, and blog counts
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch all users
  const { data: usersData, error: usersError } = await serviceSupabase.auth.admin.listUsers()
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 })
  }
  const userList = usersData?.users || []

  // Fetch all profiles
  const { data: profiles, error: profilesError } = await serviceSupabase
    .from('user_profiles')
    .select('user_id, name')
  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 })
  }

  // Fetch blog counts per user (aggregate)
  const { data: blogCounts, error: blogCountsError } = await serviceSupabase
    .from('blog_posts')
    .select('user_id, id', { count: 'exact', head: false })
  if (blogCountsError) {
    return NextResponse.json({ error: blogCountsError.message }, { status: 500 })
  }

  // Aggregate blog counts by user_id
  const blogCountMap: Record<string, number> = {}
  blogCounts?.forEach((row: { user_id: string }) => {
    if (!row.user_id) return
    blogCountMap[row.user_id] = (blogCountMap[row.user_id] || 0) + 1
  })

  // Map user info
  const result = userList.map((u: any) => {
    const profile = profiles.find((p: any) => p.user_id === u.id)
    const blogCount = blogCountMap[u.id] || 0
    return {
      id: u.id,
      email: u.email,
      name: profile?.name || '',
      blogCount,
    }
  })

  return NextResponse.json({ users: result })
} 