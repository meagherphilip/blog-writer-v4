import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContentIdeas } from "@/components/dashboard/content-ideas"

export const metadata: Metadata = {
  title: "Content Ideas | BlogAI",
  description: "AI-generated content ideas for your blog",
}

export default function IdeasPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Content Ideas"
        text="AI-generated content ideas based on your audience and trending topics."
      />
      <ContentIdeas />
    </DashboardShell>
  )
}
