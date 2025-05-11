"use client"

import { useState, useRef } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function NewPostForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [researchResult, setResearchResult] = useState<null | { title: string; main_keyword: string; key_points: string[] }>(null)
  const [activeTab, setActiveTab] = useState("prompt")
  const [topic, setTopic] = useState("The Future of AI in Content Creation")
  const [icp, setIcp] = useState("Content creators, marketers, and business owners")
  const [style, setStyle] = useState("Professional and informative")
  const [keywords, setKeywords] = useState("AI, content creation, future, technology")
  const [feedback, setFeedback] = useState("")
  const [lastPrompt, setLastPrompt] = useState<{ topic: string; icp: string; style: string; keywords: string[] } | null>(null)
  const [article, setArticle] = useState<string>("")
  const [isWriting, setIsWriting] = useState(false)

  const handleGenerate = async (override?: { topic: string; icp: string; style: string; keywords: string[]; feedback?: string }) => {
    setIsGenerating(true)
    setResearchResult(null)
    try {
      const topicVal = override?.topic ?? topic
      const icpVal = override?.icp ?? icp
      const styleVal = override?.style ?? style
      const keywordsArr = override?.keywords !== undefined ? override.keywords : (keywords.split(",").map(k => k.trim()).filter(Boolean) || [])
      const feedbackText = override?.feedback || ""
      setLastPrompt({ topic: topicVal, icp: icpVal, style: styleVal, keywords: keywordsArr })
      const res = await fetch("/api/blog/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicVal, icp: icpVal, style: styleVal, keywords: keywordsArr, feedback: feedbackText }),
      })
      const data = await res.json()
      if (res.ok) {
        setResearchResult(data)
        setActiveTab("preview")
      } else {
        setResearchResult({ title: "Error", main_keyword: "", key_points: [data.error || "Unknown error"] })
      }
    } catch (err) {
      setResearchResult({ title: "Error", main_keyword: "", key_points: [String(err)] })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lastPrompt) return
    setTopic(lastPrompt.topic)
    setIcp(lastPrompt.icp)
    setStyle(lastPrompt.style)
    setKeywords(lastPrompt.keywords.join(", "))
    await handleGenerate({ ...lastPrompt, feedback })
    setFeedback("")
  }

  async function handleGenerateFullBlog() {
    if (!researchResult) return
    setIsWriting(true)
    setArticle("")
    try {
      const res = await fetch("/api/blog/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: researchResult.title,
          main_keyword: researchResult.main_keyword,
          key_points: researchResult.key_points,
          topic,
          icp,
          style,
          keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
          // Optionally add length, seo, citations from settings tab if you want
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setArticle(data.article)
        console.log('Generated article markdown:', data.article)
        setActiveTab("fullblog")
      } else {
        setArticle(`# Error\n${data.error || "Unknown error"}`)
        setActiveTab("fullblog")
      }
    } catch (err) {
      setArticle(`# Error\n${String(err)}`)
      setActiveTab("fullblog")
    } finally {
      setIsWriting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="preview" disabled={!researchResult}>
              Outline
            </TabsTrigger>
            <TabsTrigger value="fullblog" disabled={!article}>
              Full Blog
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Blog Topic</Label>
              <Input
                id="topic"
                placeholder="Enter the topic for your blog post"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icp">Ideal Customer Profile (ICP)</Label>
              <Input
                id="icp"
                placeholder="Describe your target audience"
                value={icp}
                onChange={e => setIcp(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input
                id="style"
                placeholder="e.g. Professional, Conversational, Witty"
                value={style}
                onChange={e => setStyle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                placeholder="AI, content creation, future, technology"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
              />
            </div>

            <Button
              onClick={() => handleGenerate()}
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
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Blog Outline
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {researchResult ? (
              <div className="border rounded-md p-6 min-h-[300px] prose max-w-none">
                <h1 className="text-3xl font-bold mb-4">{researchResult.title}</h1>
                <p className="mb-2"><strong>Main Keyword:</strong> {researchResult.main_keyword}</p>
                <h2 className="text-xl font-semibold mt-4 mb-2">Key Points</h2>
                <ul className="list-disc ml-6">
                  {researchResult.key_points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-gray-500">No research results yet. Fill out the form and click Generate.</div>
            )}

            {/* Feedback Section */}
            {researchResult && (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 mt-6">
                <Label htmlFor="feedback">Feedback (optional)</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Suggest changes, request a different style, add/remove key points, etc."
                  className="min-h-[80px]"
                  disabled={isGenerating}
                />
                <Button type="submit" className="bg-black text-white hover:bg-slate-800" disabled={isGenerating || !feedback.trim()}>
                  {isGenerating ? "Regenerating..." : "Regenerate Outline with Feedback"}
                </Button>
              </form>
            )}

            {/* Generate Full Blog Button */}
            {researchResult && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleGenerateFullBlog} className="bg-black text-white hover:bg-slate-800" disabled={isWriting}>
                  {isWriting ? "Generating Full Blog..." : "Generate Full Blog"}
                </Button>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("prompt")}>
                Edit Prompt
              </Button>
              <Button className="bg-black text-white hover:bg-slate-800">Publish Post</Button>
            </div>
          </TabsContent>

          <TabsContent value="fullblog" className="space-y-6">
            {isWriting ? (
              <div className="text-gray-500">Generating full blog article...</div>
            ) : article ? (
              <div className="prose prose-slate max-w-none border rounded-md p-6 min-h-[300px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{article}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-gray-500">No full blog article generated yet.</div>
            )}
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
