import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">BlogAI</h3>
            <p className="text-slate-400">AI-powered blog content generation for businesses and content creators.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} BlogAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
