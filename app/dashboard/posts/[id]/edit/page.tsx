import NewPostForm from '@/components/dashboard/new-post-form'
import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  // Fetch the post by id
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <NewPostForm post={post} />
    </div>
  )
} 