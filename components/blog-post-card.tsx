interface BlogPostCardProps {
  title: string
  excerpt: string
  category: string
  image: string
}

export default function BlogPostCard({ title, excerpt, category, image }: BlogPostCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="p-6">
        <div className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full mb-4">
          {category}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-600 mb-4">{excerpt}</p>
        <a href="#" className="text-black font-medium inline-flex items-center">
          Read More
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </div>
    </div>
  )
}
