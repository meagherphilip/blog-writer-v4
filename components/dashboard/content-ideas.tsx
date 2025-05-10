import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const contentIdeas = [
  {
    title: "The Impact of AI on Content Creation: Opportunities and Challenges",
    description:
      "Explore how artificial intelligence is transforming the content creation landscape, discussing both the benefits and potential concerns.",
    keywords: ["AI", "Content Creation", "Technology"],
    difficulty: "Medium",
  },
  {
    title: "10 Proven Strategies to Increase Your Blog's Organic Traffic",
    description:
      "Share actionable tips and strategies that can help bloggers and content creators boost their organic search traffic.",
    keywords: ["SEO", "Traffic", "Blog Growth"],
    difficulty: "Easy",
  },
  {
    title: "The Psychology Behind Viral Content: What Makes People Share?",
    description:
      "Analyze the psychological factors that influence content sharing behavior and how creators can leverage these insights.",
    keywords: ["Psychology", "Viral Content", "Social Media"],
    difficulty: "Medium",
  },
  {
    title: "How to Create a Content Strategy That Aligns with Your Business Goals",
    description:
      "Guide readers through the process of developing a content strategy that supports their specific business objectives and target audience.",
    keywords: ["Content Strategy", "Business Goals", "Marketing"],
    difficulty: "Hard",
  },
  {
    title: "The Future of Video Content: Trends to Watch in 2023",
    description:
      "Discuss emerging trends in video content creation and consumption, including short-form video, live streaming, and interactive content.",
    keywords: ["Video Content", "Trends", "Digital Marketing"],
    difficulty: "Easy",
  },
]

export function ContentIdeas() {
  return (
    <div className="grid gap-4">
      {contentIdeas.map((idea, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{idea.title}</h3>
                <Badge
                  variant="outline"
                  className={
                    idea.difficulty === "Easy"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                      : idea.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                        : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                  }
                >
                  {idea.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{idea.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {idea.keywords.map((keyword, i) => (
                  <Badge key={i} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end mt-2">
                <Button size="sm" className="bg-black text-white hover:bg-slate-800">
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
