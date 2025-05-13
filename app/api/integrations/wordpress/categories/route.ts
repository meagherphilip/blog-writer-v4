import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch integration
  const { data: integration, error } = await supabase
    .from('user_wordpress_integrations')
    .select('wp_url, wp_username, wp_app_password')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !integration) return NextResponse.json({ error: 'No integration found' }, { status: 400 })

  try {
    const apiUrl = `${integration.wp_url.replace(/\/$/, '')}/wp-json/wp/v2/categories`
    const auth = Buffer.from(`${integration.wp_username}:${integration.wp_app_password}`).toString('base64')
    const res = await fetch(apiUrl, {
      headers: { 'Authorization': `Basic ${auth}` },
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }
    const categories = await res.json()
    return NextResponse.json({ categories })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 