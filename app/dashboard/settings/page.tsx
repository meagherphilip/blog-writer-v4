import type { Metadata } from "next"
import { SettingsForm } from "@/components/dashboard/settings-form"

export const metadata: Metadata = {
  title: "Settings | BlogAI",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <SettingsForm />
    </div>
  )
}
