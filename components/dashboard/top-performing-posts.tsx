import { BarChart } from "lucide-react"

const topPosts = [
  {
    title: "The Future of AI in Healthcare: Trends to Watch",
    views: 2100,
    category: "Technology",
  },
  {
    title: "How to Create an Effective Content Calendar",
    views: 1567,
    category: "Content",
  },
  {
    title: "10 Strategies to Boost Your Content Marketing ROI",
    views: 1245,
    category: "Marketing",
  },
  {
    title: "The Psychology of Color in Marketing",
    views: 1432,
    category: "Marketing",
  },
  {
    title: "Essential Tools for Digital Marketers in 2023",
    views: 1089,
    category: "Marketing",
  },
]

export function TopPerformingPosts() {
  return (
    <div className="space-y-8">
      {topPosts.map((post, index) => (
        <div key={index} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{post.title}</p>
            <div className="flex items-center pt-2">
              <div className="mr-2 h-4 w-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-[10px] font-bold">
                {index + 1}
              </div>
              <p className="text-sm text-muted-foreground">{post.category}</p>
              <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
                <BarChart className="h-3.5 w-3.5" />
                {post.views.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
