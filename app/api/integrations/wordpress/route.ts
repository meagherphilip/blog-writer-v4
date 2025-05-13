import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_wordpress_integrations')
    .select('id, wp_url, created_at')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ integration: null })
  return NextResponse.json({ integration: data })
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { wp_url, wp_username, wp_app_password, wp_access_token, wp_refresh_token } = body
  if (!wp_url) return NextResponse.json({ error: 'Missing WordPress site URL' }, { status: 400 })

  // Upsert integration for this user
  const { error } = await supabase
    .from('user_wordpress_integrations')
    .upsert({
      user_id: user.id,
      wp_url,
      wp_username,
      wp_app_password,
      wp_access_token,
      wp_refresh_token,
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
} 