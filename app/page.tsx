import { ArrowRight, Sparkles, Zap, BarChart, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FeatureCard from "@/components/feature-card"
import TestimonialCard from "@/components/testimonial-card"
import BlogPostCard from "@/components/blog-post-card"
import NewsletterSignup from "@/components/newsletter-signup"
import { TypewriterEffect } from "@/components/typewriter-effect"
import Link from "next/link"

export default function HomePage() {
  const typewriterTexts = ["Create Engaging", "Analyze Your", "Optimize Your"]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[10%] w-[200%] h-[80%] rounded-[100%] bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-50 blur-3xl"></div>
          </div>
          <div className="container px-4 md:px-6 mx-auto max-w-6xl relative">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-slate-100 text-slate-800 mb-2">
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  <span>AI-Powered Blog Generation</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 min-h-[60px] md:min-h-[72px] lg:min-h-[84px] flex items-center">
                    <TypewriterEffect texts={typewriterTexts} speed={70} deletionSpeed={40} delayBetweenTexts={3000} />
                  </div>
                  <div className="text-black">Blog Content with AI</div>
                </h1>
                <p className="text-xl text-slate-600 max-w-[600px]">
                  Generate high-quality, SEO-optimized blog posts in seconds. Save time and scale your content strategy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-black text-white hover:bg-slate-800" asChild>
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                        <img
                          src={`/diverse-group.png?height=32&width=32&query=person ${i}`}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p>
                    Join <span className="font-medium">2,000+</span> content creators
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full max-w-[500px]">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200/50">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-transparent opacity-50 z-10"></div>
                  <img
                    src="/updated-dashboard.png"
                    alt="AI Blog Generator Dashboard"
                    className="w-full h-auto relative z-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-1/3 h-10 bg-slate-50 blur-xl"></div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-slate-600 max-w-[800px] mx-auto">
                Everything you need to create exceptional blog content at scale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap />}
                title="AI-Powered Writing"
                description="Generate complete blog posts with a single prompt. Our AI understands your brand voice and style."
              />
              <FeatureCard
                icon={<BarChart />}
                title="SEO Optimization"
                description="Every post is optimized for search engines with the right keywords, meta descriptions, and structure."
              />
              <FeatureCard
                icon={<FileText />}
                title="Content Templates"
                description="Choose from dozens of proven blog templates for different industries and content types."
              />
              <FeatureCard
                icon={<Users />}
                title="Audience Targeting"
                description="Create content tailored to specific audience segments and buyer personas."
              />
              <FeatureCard
                icon={<Sparkles />}
                title="Image Generation"
                description="Automatically generate relevant images and graphics for your blog posts."
              />
              <FeatureCard
                icon={<ArrowRight />}
                title="One-Click Publishing"
                description="Publish directly to WordPress, Medium, or export to your CMS of choice."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-slate-600 max-w-[800px] mx-auto">
                Create engaging blog content in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Enter Your Topic",
                  description: "Provide a topic or keyword, and our AI will generate content ideas.",
                },
                {
                  step: "2",
                  title: "Customize Your Content",
                  description: "Edit, refine, and personalize the generated content to match your brand.",
                },
                {
                  step: "3",
                  title: "Publish & Share",
                  description: "Export your polished blog post or publish directly to your platform.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm relative">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Blog Posts */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sample AI-Generated Posts</h2>
              <p className="text-xl text-slate-600 max-w-[800px] mx-auto">
                See the quality of content our AI can create for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BlogPostCard
                title="10 Strategies to Boost Your Content Marketing ROI"
                excerpt="Discover proven tactics to maximize the return on your content marketing investment and drive more conversions."
                category="Marketing"
                image="/content-marketing-strategy.png"
              />
              <BlogPostCard
                title="The Future of AI in Healthcare: Trends to Watch"
                excerpt="Explore how artificial intelligence is transforming patient care, diagnostics, and medical research."
                category="Technology"
                image="/futuristic-ai-healthcare.png"
              />
              <BlogPostCard
                title="Sustainable Business Practices for 2023 and Beyond"
                excerpt="Learn how companies are implementing eco-friendly initiatives to reduce their environmental impact."
                category="Business"
                image="/sustainable-green-office.png"
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-slate-600 max-w-[800px] mx-auto">
                Join thousands of content creators who trust our AI blog generator
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="This tool has cut my content creation time in half. The AI-generated posts are so good that they require minimal editing."
                author="Sarah Johnson"
                role="Content Manager at TechCrunch"
                avatar="/professional-woman-headshot.png"
              />
              <TestimonialCard
                quote="I was skeptical about AI writing, but this platform blew me away. The content is engaging, well-researched, and sounds natural."
                author="Michael Chen"
                role="Digital Marketing Director"
                avatar="/asian-man-professional-headshot.png"
              />
              <TestimonialCard
                quote="As a small business owner, I couldn't afford a content team. This AI solution has helped me maintain a consistent blog schedule."
                author="Jessica Williams"
                role="Founder, Bright Ideas LLC"
                avatar="/young-entrepreneur-woman.png"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-slate-600 max-w-[800px] mx-auto">
                Choose the plan that works for your content needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$29",
                  description: "Perfect for individuals and small blogs",
                  features: [
                    "10 AI-generated posts per month",
                    "Basic SEO optimization",
                    "5 content templates",
                    "Email support",
                  ],
                },
                {
                  name: "Professional",
                  price: "$79",
                  description: "Ideal for growing businesses and content teams",
                  features: [
                    "50 AI-generated posts per month",
                    "Advanced SEO optimization",
                    "All content templates",
                    "Image generation",
                    "Priority support",
                  ],
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "$199",
                  description: "For agencies and high-volume content creators",
                  features: [
                    "Unlimited AI-generated posts",
                    "Custom SEO strategy",
                    "Custom templates",
                    "API access",
                    "Dedicated account manager",
                  ],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-8 ${plan.popular ? "bg-black text-white ring-4 ring-black" : "bg-white border border-slate-200"}`}
                >
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 text-xs font-medium bg-white text-black rounded-full mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`${plan.popular ? "text-slate-300" : "text-slate-600"}`}>/month</span>
                  </div>
                  <p className={`mb-6 ${plan.popular ? "text-slate-300" : "text-slate-600"}`}>{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg
                          className={`h-5 w-5 mr-2 ${plan.popular ? "text-white" : "text-black"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-white text-black hover:bg-slate-100" : "bg-black text-white hover:bg-slate-800"}`}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <NewsletterSignup />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
