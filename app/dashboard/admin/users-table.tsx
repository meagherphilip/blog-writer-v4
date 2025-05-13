"use client"

import React, { useEffect, useState } from 'react'

interface AdminUser {
  id: string
  email: string
  name: string
  blogCount: number
}

export default function AdminUsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/users')
        if (!res.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await res.json()
        setUsers(data.users)
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) return <div>Loading users...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Blog Count</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.name || <span className="italic text-gray-400">(No name)</span>}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.blogCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 