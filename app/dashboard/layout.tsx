import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"
import { UserNav } from "@/components/dashboard/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">BlogAI</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <DashboardNav />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
