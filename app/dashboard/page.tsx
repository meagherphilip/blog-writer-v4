import type { Metadata } from "next"
import { ArrowUpRight, FileText, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { Overview } from "@/components/dashboard/overview"
import { TopPerformingPosts } from "@/components/dashboard/top-performing-posts"
import { ContentIdeas } from "@/components/dashboard/content-ideas"

export const metadata: Metadata = {
  title: "Dashboard | BlogAI",
  description: "Manage your AI-generated blog content",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your AI-generated blog content and track performance.">
        <Button className="bg-black text-white hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" /> New Blog Post
        </Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">+18.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground">+1.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Generated</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42,850</div>
            <p className="text-xs text-muted-foreground">+8,294 from last month</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>View metrics for your blog posts over the last 30 days.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Your most viewed blog posts this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <TopPerformingPosts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed metrics and performance data for your blog content.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center border-t">
              <div className="text-center">
                <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground mt-1">Detailed analytics view will appear here.</p>
                <Button variant="outline" className="mt-4">
                  View Full Analytics <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Recent Blog Posts</CardTitle>
                <CardDescription>Manage and edit your AI-generated blog posts.</CardDescription>
              </div>
              <Button className="ml-auto bg-black text-white hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" /> New Post
              </Button>
            </CardHeader>
            <CardContent>
              <RecentPosts />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ideas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Ideas</CardTitle>
              <CardDescription>AI-generated content ideas based on your audience and trending topics.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentIdeas />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
