import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NewPostForm } from "@/components/dashboard/new-post-form"

export const metadata: Metadata = {
  title: "New Blog Post | BlogAI",
  description: "Create a new AI-generated blog post",
}

export default function NewPostPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create New Blog Post" text="Generate a new AI-powered blog post for your audience." />
      <div className="grid gap-8">
        <NewPostForm />
      </div>
    </DashboardShell>
  )
}
