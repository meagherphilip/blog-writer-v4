import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, content, categories = [], status = 'draft', date } = body
  if (!title || !content) return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })

  // Fetch integration
  const { data: integration, error } = await supabase
    .from('user_wordpress_integrations')
    .select('wp_url, wp_username, wp_app_password')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !integration) return NextResponse.json({ error: 'No integration found' }, { status: 400 })

  try {
    const apiUrl = `${integration.wp_url.replace(/\/$/, '')}/wp-json/wp/v2/posts`
    const auth = Buffer.from(`${integration.wp_username}:${integration.wp_app_password}`).toString('base64')
    const postBody: any = {
      title,
      content,
      status,
      categories,
    }
    if (status === 'future' && date) {
      postBody.date = date
    }
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }
    const post = await res.json()
    return NextResponse.json({ post })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 