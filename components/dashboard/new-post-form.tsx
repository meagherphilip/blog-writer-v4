"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export function NewPostForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [activeTab, setActiveTab] = useState("prompt")

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent(`# The Future of AI in Content Creation

## Introduction

Artificial Intelligence (AI) is revolutionizing the way we create, distribute, and consume content. From automated writing assistants to sophisticated image generators, AI tools are becoming increasingly integrated into the content creation workflow. This blog post explores the current state of AI in content creation, its benefits and limitations, and what the future might hold for content creators.

## How AI is Transforming Content Creation

### Automated Writing and Editing

AI-powered writing tools like GPT-4 can now generate human-like text, assist with editing, and even help overcome writer's block. These tools analyze patterns in language and can produce coherent, contextually relevant content based on simple prompts.

### Image and Video Generation

With the advent of tools like DALL-E, Midjourney, and Stable Diffusion, creating visual content has never been more accessible. These AI systems can generate images from text descriptions, opening up new possibilities for visual storytelling.

### Content Personalization

AI algorithms can analyze user behavior and preferences to deliver personalized content experiences. This level of customization was previously impossible at scale but is now becoming standard practice.

## Benefits of AI in Content Creation

1. **Increased Efficiency**: AI can dramatically reduce the time spent on routine content tasks.
2. **Scalability**: Create more content with fewer resources.
3. **Consistency**: Maintain a consistent voice and quality across all content.
4. **Data-Driven Insights**: Make better content decisions based on AI analysis.

## Challenges and Limitations

Despite its advantages, AI content creation faces several challenges:

- **Quality Control**: AI-generated content may lack the nuance and depth of human-created content.
- **Ethical Concerns**: Issues around plagiarism, bias, and authenticity remain unresolved.
- **Creative Limitations**: AI still struggles with truly original thinking and emotional intelligence.

## The Future of AI and Human Collaboration

The most promising future for content creation lies not in AI replacing humans, but in effective collaboration between the two. AI can handle routine tasks, generate ideas, and provide data-driven insights, while humans focus on strategy, creativity, and emotional connection.

## Conclusion

AI is not replacing human content creators—it's augmenting their capabilities. By embracing AI tools and developing new workflows that leverage both artificial and human intelligence, content creators can produce better work more efficiently than ever before.

The future of content creation is neither purely human nor purely artificial—it's collaborative, with each contributing their unique strengths to the creative process.`)

      setIsGenerating(false)
      setActiveTab("preview")
    }, 3000)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedContent}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Post Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your blog post"
                defaultValue="The Future of AI in Content Creation"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="technology">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select defaultValue="informative">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                placeholder="AI, content creation, future, technology"
                defaultValue="AI, content creation, future, technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Brief Description or Outline</Label>
              <Textarea
                id="description"
                placeholder="Describe what you want your blog post to be about"
                className="min-h-[100px]"
                defaultValue="Explore how AI is changing content creation, the benefits and challenges, and what the future holds for content creators working with AI tools."
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full bg-black text-white hover:bg-slate-800"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Blog Post
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="border rounded-md p-6 min-h-[500px] prose max-w-none">
              {generatedContent.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={index} className="text-3xl font-bold mb-6">
                      {paragraph.substring(2)}
                    </h1>
                  )
                } else if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                      {paragraph.substring(3)}
                    </h2>
                  )
                } else if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                      {paragraph.substring(4)}
                    </h3>
                  )
                } else if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={index} className="list-disc pl-6 mb-4">
                      {paragraph.split("\n").map((item, i) => (
                        <li key={i} className="mb-1">
                          {item.substring(2)}
                        </li>
                      ))}
                    </ul>
                  )
                } else if (paragraph.match(/^\d+\. /)) {
                  return (
                    <ol key={index} className="list-decimal pl-6 mb-4">
                      {paragraph.split("\n").map((item, i) => {
                        const content = item.replace(/^\d+\. /, "")
                        return (
                          <li key={i} className="mb-1">
                            {content}
                          </li>
                        )
                      })}
                    </ol>
                  )
                } else {
                  return (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  )
                }
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("prompt")}>
                Edit Prompt
              </Button>
              <Button className="bg-black text-white hover:bg-slate-800">Publish Post</Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">AI Generation Settings</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="creativity">Creativity</Label>
                  <span className="text-sm text-muted-foreground">0.7</span>
                </div>
                <Slider id="creativity" defaultValue={[0.7]} max={1} step={0.1} className="w-full" />
                <p className="text-sm text-muted-foreground">Higher values produce more creative and varied outputs.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="length">Length</Label>
                  <span className="text-sm text-muted-foreground">Medium</span>
                </div>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (300-500 words)</SelectItem>
                    <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                    <SelectItem value="long">Long (1500-2000 words)</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive (2500+ words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo">SEO Optimization</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger>
                    <SelectValue placeholder="Select SEO level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Controls how heavily the content is optimized for search engines.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="citations">Include Citations</Label>
                <Select defaultValue="when-needed">
                  <SelectTrigger>
                    <SelectValue placeholder="Select citation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="when-needed">When Needed</SelectItem>
                    <SelectItem value="always">Always</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
