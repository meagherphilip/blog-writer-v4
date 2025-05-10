"use client"

import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const posts = [
  {
    id: "1",
    title: "10 Strategies to Boost Your Content Marketing ROI",
    status: "published",
    category: "Marketing",
    date: "2023-04-23",
    views: 1245,
  },
  {
    id: "2",
    title: "The Future of AI in Healthcare: Trends to Watch",
    status: "published",
    category: "Technology",
    date: "2023-04-20",
    views: 2100,
  },
  {
    id: "3",
    title: "Sustainable Business Practices for 2023 and Beyond",
    status: "draft",
    category: "Business",
    date: "2023-04-18",
    views: 0,
  },
  {
    id: "4",
    title: "How to Build a Successful Social Media Strategy",
    status: "published",
    category: "Marketing",
    date: "2023-04-15",
    views: 987,
  },
  {
    id: "5",
    title: "Understanding Blockchain Technology: A Beginner's Guide",
    status: "draft",
    category: "Technology",
    date: "2023-04-12",
    views: 0,
  },
]

export function RecentPosts() {
  const [data, setData] = useState(posts)

  const deletePost = (id: string) => {
    setData(data.filter((post) => post.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Views</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>
              <Badge
                variant={post.status === "published" ? "default" : "outline"}
                className={post.status === "published" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {post.status}
              </Badge>
            </TableCell>
            <TableCell>{post.category}</TableCell>
            <TableCell>{post.date}</TableCell>
            <TableCell className="text-right">{post.views.toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => deletePost(post.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
