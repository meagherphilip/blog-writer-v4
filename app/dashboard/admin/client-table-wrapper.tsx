'use client'

import dynamic from 'next/dynamic'

const AdminUsersTable = dynamic(() => import('./users-table'), { ssr: false })

export default function ClientTableWrapper() {
  return <AdminUsersTable />
} 