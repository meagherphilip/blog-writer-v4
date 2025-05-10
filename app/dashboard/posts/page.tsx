import type { Metadata } from "next"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PostsTable } from "@/components/dashboard/posts-table"

export const metadata: Metadata = {
  title: "Blog Posts | BlogAI",
  description: "Manage your AI-generated blog posts",
}

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage and edit your AI-generated blog posts.</p>
        </div>
        <Button asChild className="bg-black text-white hover:bg-slate-800">
          <Link href="/dashboard/new">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>
      <PostsTable />
    </div>
  )
}
