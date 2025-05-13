"use client"

import { useState, useRef, useEffect } from "react"
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
import { supabase } from "@/lib/supabaseClient"
import { useSession } from '@supabase/auth-helpers-react'
import { formatISO } from 'date-fns'
import { marked } from 'marked'

export default function NewPostForm({ post }: { post?: any }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [researchResult, setResearchResult] = useState<null | { title: string; main_keyword: string; key_points: string[] }>(null)
  const [activeTab, setActiveTab] = useState("prompt")
  const [topic, setTopic] = useState(post?.topic || "The Future of AI in Content Creation")
  const [icp, setIcp] = useState(post?.icp || "Content creators, marketers, and business owners")
  const [style, setStyle] = useState(post?.style || "Professional and informative")
  const [keywords, setKeywords] = useState(post?.keywords || "AI, content creation, future, technology")
  const [feedback, setFeedback] = useState("")
  const [lastPrompt, setLastPrompt] = useState<{ topic: string; icp: string; style: string; keywords: string[] } | null>(null)
  const [article, setArticle] = useState<string>(post?.content || "")
  const [isWriting, setIsWriting] = useState(false)
  const [creativity, setCreativity] = useState(0.7)
  const [length, setLength] = useState('medium')
  const [seo, setSeo] = useState('balanced')
  const [citations, setCitations] = useState('when-needed')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [categoryId, setCategoryId] = useState<string>(post?.category_id || "")
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [outlineId, setOutlineId] = useState<string | null>(null)
  const [wpCategories, setWpCategories] = useState<{ id: number; name: string }[]>([])
  const [wpCategoryIds, setWpCategoryIds] = useState<number[]>([])
  const [wpStatus, setWpStatus] = useState<'draft' | 'publish' | 'future'>('draft')
  const [wpDate, setWpDate] = useState<string>("")
  const [wpLoading, setWpLoading] = useState(false)
  const [wpMessage, setWpMessage] = useState<string | null>(null)
  const [wpError, setWpError] = useState<string | null>(null)
  const session = useSession()

  useEffect(() => {
    async function fetchCategories() {
      let query = supabase.from("categories").select("id, name, user_id").order("name")
      if (session) {
        query = query.or(`user_id.is.null,user_id.eq.${session.user.id}`)
      } else {
        query = query.is("user_id", null)
      }
      const { data, error } = await query
      if (!error && data) setCategories(data)
    }
    fetchCategories()
  }, [session])

  useEffect(() => {
    async function fetchWpCategories() {
      try {
        const res = await fetch('/api/integrations/wordpress/categories')
        const data = await res.json()
        if (res.ok && data.categories) {
          setWpCategories(data.categories)
        }
      } catch {}
    }
    fetchWpCategories()
  }, [])

  const handleGenerate = async (override?: { topic: string; icp: string; style: string; keywords: string[]; feedback?: string }) => {
    setIsGenerating(true)
    setResearchResult(null)
    try {
      const topicVal = override?.topic ?? topic
      const icpVal = override?.icp ?? icp
      const styleVal = override?.style ?? style
      const keywordsArr = override?.keywords !== undefined ? override.keywords : (keywords.split(",").map((k: string) => k.trim()).filter(Boolean) || [])
      const feedbackText = override?.feedback || ""
      setLastPrompt({ topic: topicVal, icp: icpVal, style: styleVal, keywords: keywordsArr })
      const res = await fetch("/api/blog/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicVal, icp: icpVal, style: styleVal, keywords: keywordsArr, feedback: feedbackText, creativity, length, seo, citations }),
      })
      const data = await res.json()
      if (res.ok) {
        setResearchResult(data)
        setActiveTab("preview")
        // Save outline to blog_outlines
        if (session) {
          const { data: outlineRow, error } = await supabase
            .from('blog_outlines')
            .insert({
              user_id: session.user.id,
              outline: data,
              blog_post_id: post?.id || null
            })
            .select()
            .single()
          if (!error && outlineRow) {
            setOutlineId(outlineRow.id)
          } else {
            setOutlineId(null)
          }
        }
      } else {
        setResearchResult({ title: "Error", main_keyword: "", key_points: [data.error || "Unknown error"] })
        setOutlineId(null)
      }
    } catch (err) {
      setResearchResult({ title: "Error", main_keyword: "", key_points: [String(err)] })
      setOutlineId(null)
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
    // Save feedback to ai_feedback
    if (session && outlineId && feedback.trim()) {
      await supabase.from('ai_feedback').insert({
        user_id: session.user.id,
        outline_id: outlineId,
        feedback_text: feedback.trim(),
      })
    }
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
          keywords: keywords.split(",").map((k: string) => k.trim()).filter(Boolean),
          creativity,
          length,
          seo,
          citations,
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

  async function handleAddCategory() {
    if (!newCategoryName.trim() || !session) return;
    setLoadingCategory(true)
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newCategoryName.trim(), slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'), user_id: session.user.id })
      .select()
      .single()
    setLoadingCategory(false)
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
      setCategories((prev) => [...prev, data])
      setCategoryId(data.id)
      setAddingCategory(false)
      setNewCategoryName("")
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, '')     // Trim leading/trailing hyphens
      .replace(/-{2,}/g, '-');     // Replace multiple hyphens with one
  }

  async function handleSavePost(status: 'draft' | 'published') {
    if (!session) {
      alert('You must be logged in to save a post.');
      return;
    }
    if (!article || !categoryId) {
      alert('Please generate a blog and select a category before saving.');
      return;
    }
    const titleToUse = researchResult?.title || topic;
    const slug = generateSlug(titleToUse);
    let error;
    if (post && post.id) {
      // Update existing post
      ({ error } = await supabase.from('blog_posts').update({
        title: titleToUse,
        slug,
        content: article,
        status,
        category_id: categoryId,
      }).eq('id', post.id));
    } else {
      // Insert new post
      ({ error } = await supabase.from('blog_posts').insert({
        user_id: session.user.id,
        title: titleToUse,
        slug,
        content: article,
        status,
        category_id: categoryId,
      }));
    }
    if (error) {
      alert('Failed to save post: ' + error.message);
    } else {
      alert(status === 'published' ? 'Blog post published!' : 'Draft saved!');
      // Optionally reset form or redirect
    }
  }

  async function handlePublishToWordPress() {
    setWpLoading(true)
    setWpMessage(null)
    setWpError(null)
    try {
      const htmlContent = marked(article)
      const res = await fetch('/api/integrations/wordpress/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: researchResult?.title || topic,
          content: htmlContent,
          categories: wpCategoryIds,
          status: wpStatus,
          date: wpStatus === 'future' && wpDate ? formatISO(new Date(wpDate)) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to publish')
      setWpMessage('Published to WordPress!')
    } catch (err: any) {
      setWpError(err.message)
    } finally {
      setWpLoading(false)
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
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                  <div className="border-t mt-2 pt-2">
                    {addingCategory ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={newCategoryName}
                          onChange={e => setNewCategoryName(e.target.value)}
                          placeholder="New category name"
                          className="h-8"
                          disabled={loadingCategory}
                        />
                        <Button size="sm" onClick={handleAddCategory} disabled={loadingCategory || !newCategoryName.trim()}>
                          {loadingCategory ? "Adding..." : "Add"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddingCategory(false)} disabled={loadingCategory}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setAddingCategory(true)}>
                        + Add Category
                      </Button>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
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
              <div className="flex gap-2">
                <Button className="bg-gray-200 text-black hover:bg-gray-300" onClick={() => handleSavePost('draft')}>Save as Draft</Button>
                <Button className="bg-black text-white hover:bg-slate-800" onClick={() => handleSavePost('published')}>Publish Post</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fullblog" className="space-y-6">
            {isWriting ? (
              <div className="text-gray-500">Generating full blog article...</div>
            ) : article ? (
              <>
                <div className="prose prose-slate max-w-none border rounded-md p-6 min-h-[300px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{article}</ReactMarkdown>
                </div>
                {/* WordPress Publishing UI */}
                <div className="border rounded-md p-6 mt-6 space-y-4">
                  <h3 className="text-lg font-bold mb-2">Publish to WordPress</h3>
                  <div className="space-y-2">
                    <Label htmlFor="wp-categories">Categories</Label>
                    <div id="wp-categories" className="flex flex-wrap gap-3">
                      {wpCategories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={wpCategoryIds.includes(cat.id)}
                            onChange={e => {
                              setWpCategoryIds(ids =>
                                e.target.checked
                                  ? [...ids, cat.id]
                                  : ids.filter(id => id !== cat.id)
                              )
                            }}
                          />
                          <span>{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wp-status">Status</Label>
                    <Select value={wpStatus} onValueChange={val => setWpStatus(val as any)}>
                      <SelectTrigger id="wp-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="publish">Publish Now</SelectItem>
                        <SelectItem value="future">Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {wpStatus === 'future' && (
                    <div className="space-y-2">
                      <Label htmlFor="wp-date">Schedule Date/Time</Label>
                      <Input
                        id="wp-date"
                        type="datetime-local"
                        value={wpDate}
                        onChange={e => setWpDate(e.target.value)}
                      />
                    </div>
                  )}
                  <Button onClick={handlePublishToWordPress} disabled={wpLoading || !article} className="bg-black text-white hover:bg-slate-800">
                    {wpLoading ? 'Publishing...' : 'Publish to WordPress'}
                  </Button>
                  {wpMessage && <div className="text-green-600 text-sm pt-2">{wpMessage}</div>}
                  {wpError && <div className="text-red-600 text-sm pt-2">{wpError}</div>}
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab("preview")}>Back to Outline</Button>
                  <div className="flex gap-2">
                    <Button className="bg-gray-200 text-black hover:bg-gray-300" onClick={() => handleSavePost('draft')}>Save as Draft</Button>
                    <Button className="bg-black text-white hover:bg-slate-800" onClick={() => handleSavePost('published')}>Publish Post</Button>
                  </div>
                </div>
              </>
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
                <Slider id="creativity" value={[creativity]} max={1} step={0.1} className="w-full" onValueChange={([v]) => setCreativity(v)} />
                <p className="text-sm text-muted-foreground">Higher values produce more creative and varied outputs.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="length">Length</Label>
                  <span className="text-sm text-muted-foreground">Medium</span>
                </div>
                <Select value={length} onValueChange={setLength}>
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
                <Select value={seo} onValueChange={setSeo}>
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
                <Select value={citations} onValueChange={setCitations}>
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
