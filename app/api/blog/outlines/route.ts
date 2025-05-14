import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const blogPostId = req.nextUrl.searchParams.get('blog_post_id')
  if (!blogPostId) return NextResponse.json({ error: 'Missing blog_post_id' }, { status: 400 })

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch outlines for this post and user
  const { data: outlines, error } = await supabase
    .from('blog_outlines')
    .select('id, outline, created_at')
    .eq('user_id', user.id)
    .eq('blog_post_id', blogPostId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch feedback for all outlines
  const outlineIds = outlines.map(o => o.id)
  let feedbacks: any[] = []
  if (outlineIds.length > 0) {
    const { data: fb, error: fbError } = await supabase
      .from('ai_feedback')
      .select('outline_id, feedback_text, created_at')
      .in('outline_id', outlineIds)
    if (!fbError && fb) feedbacks = fb
  }

  // Attach feedback to outlines
  const outlinesWithFeedback = outlines.map(o => ({
    ...o,
    feedback: feedbacks.filter(fb => fb.outline_id === o.id)
  }))

  return NextResponse.json({ outlines: outlinesWithFeedback })
} 