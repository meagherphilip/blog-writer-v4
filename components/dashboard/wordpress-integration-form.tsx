"use client"

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function WordPressIntegrationForm() {
  const [integration, setIntegration] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    wp_url: '',
    wp_username: '',
    wp_app_password: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchIntegration() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/integrations/wordpress')
        const data = await res.json()
        if (data.integration) {
          setIntegration(data.integration)
          setForm(f => ({ ...f, wp_url: data.integration.wp_url }))
        }
      } catch (err: any) {
        setError('Failed to load integration')
      } finally {
        setLoading(false)
      }
    }
    fetchIntegration()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/integrations/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save integration')
      setSuccess('Integration saved!')
      setIntegration({ ...integration, wp_url: form.wp_url })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDisconnect() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      // Remove integration by setting blank values
      const res = await fetch('/api/integrations/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wp_url: '', wp_username: '', wp_app_password: '' }),
      })
      if (!res.ok) throw new Error('Failed to disconnect')
      setIntegration(null)
      setForm({ wp_url: '', wp_username: '', wp_app_password: '' })
      setSuccess('Integration removed.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      {loading ? (
        <div>Loading integration...</div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="wp_url">WordPress Site URL</Label>
            <Input
              id="wp_url"
              type="url"
              placeholder="https://yourblog.com"
              value={form.wp_url}
              onChange={e => setForm(f => ({ ...f, wp_url: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wp_username">Username</Label>
            <Input
              id="wp_username"
              type="text"
              placeholder="WordPress Username"
              value={form.wp_username}
              onChange={e => setForm(f => ({ ...f, wp_username: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wp_app_password">Application Password</Label>
            <Input
              id="wp_app_password"
              type="password"
              placeholder="Application Password"
              value={form.wp_app_password}
              onChange={e => setForm(f => ({ ...f, wp_app_password: e.target.value }))}
            />
          </div>
          <div className="flex gap-4 items-center pt-2">
            <Button type="submit" disabled={saving} className="text-base font-medium">
              {integration ? 'Update Integration' : 'Connect'}
            </Button>
            {integration && (
              <Button type="button" variant="outline" onClick={handleDisconnect} disabled={saving} className="text-base font-medium">
                Disconnect
              </Button>
            )}
          </div>
          {error && <div className="text-red-600 text-sm pt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm pt-2">{success}</div>}
        </>
      )}
    </form>
  )
} 