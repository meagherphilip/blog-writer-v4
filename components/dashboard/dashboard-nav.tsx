"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, FileText, ImageIcon, LayoutDashboard, PenTool, Settings, Sparkles } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    title: "New Post",
    href: "/dashboard/new",
    icon: Sparkles,
  },
  {
    title: "Content Ideas",
    href: "/dashboard/ideas",
    icon: PenTool,
  },
  {
    title: "Media",
    href: "/dashboard/media",
    icon: ImageIcon,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
            pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
          }`}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
