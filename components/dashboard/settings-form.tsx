"use client"

import { useState, useEffect, ChangeEvent, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabaseClient"
import { useSession } from '@supabase/auth-helpers-react'

export function SettingsForm() {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [email, setEmail] = useState("")
  const [profile, setProfile] = useState<any>(null)
  const session = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      if (!session) return;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (error) {
        console.error("Error fetching profile:", error)
      } else if (data) {
        setProfile(data)
        setEmail(session.user.email || "")
      } else {
        // No profile found, auto-create
        const pendingName = localStorage.getItem('pendingProfileName') || '';
        const { error: upsertError } = await supabase.from('user_profiles').upsert({
          user_id: session.user.id,
          name: pendingName,
          language: 'en',
          timezone: 'utc',
          avatar_url: ''
        }, { onConflict: 'user_id' });
        if (!upsertError) localStorage.removeItem('pendingProfileName');
        // Optionally fetch again
        const { data: newProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (fetchError) {
          console.error("Error fetching new profile:", fetchError)
        } else if (newProfile) {
          setProfile(newProfile)
          setEmail(session.user.email || "")
        }
      }
    }
    fetchProfile()
  }, [session])

  const handleSave = async () => {
    setIsSaving(true)
    if (session && profile) {
      const updateData: any = {
        name: profile.name ?? '',
        bio: profile.bio ?? '',
        website: profile.website ?? '',
        company: profile.company ?? '',
        language: profile.language ?? '',
        timezone: profile.timezone ?? '',
      };
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', session.user.id);
      if (error) {
        console.error("Update error:", error)
        alert("Failed to update profile: " + error.message)
      } else {
        // Re-fetch the updated profile
        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (fetchError) {
          console.error("Fetch error:", fetchError)
          alert("Failed to fetch updated profile: " + fetchError.message)
        } else if (data) {
          setProfile(data)
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
        }
      }
    }
    setIsSaving(false)
  }

  const handleSendMagicLink = () => {
    setMagicLinkSent(true)
    setTimeout(() => {
      setMagicLinkSent(false)
    }, 5000)
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session) return
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Max file size is 2MB.')
      return
    }
    setAvatarUploading(true)
    const fileExt = file.name.split('.').pop()
    const filePath = `${session.user.id}.${fileExt}`
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (uploadError) {
      alert('Failed to upload avatar: ' + uploadError.message)
      setAvatarUploading(false)
      return
    }
    // Get public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = urlData?.publicUrl
    if (!publicUrl) {
      alert('Failed to get avatar URL.')
      setAvatarUploading(false)
      return
    }
    // Update profile
    const { error: updateError } = await supabase.from('user_profiles').update({ avatar_url: publicUrl }).eq('user_id', session.user.id)
    if (updateError) {
      alert('Failed to update profile: ' + updateError.message)
      setAvatarUploading(false)
      return
    }
    setProfile((p: any) => ({ ...p, avatar_url: publicUrl }))
    setAvatarUploading(false)
  }

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      {showSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertDescription>Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile information and public details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || "/avatar.png"} alt="Profile" />
                <AvatarFallback>{profile?.name ? profile.name.split(' ').map((n: string) => n[0]).join('') : 'JD'}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={avatarUploading}>
                  {avatarUploading ? 'Uploading...' : 'Change avatar'}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={profile?.name || ''} onChange={e => setProfile((p: any) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={profile?.bio || ''}
                onChange={e => setProfile((p: any) => ({ ...p, bio: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={profile?.website || ''} onChange={e => setProfile((p: any) => ({ ...p, website: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={profile?.company || ''} onChange={e => setProfile((p: any) => ({ ...p, company: e.target.value }))} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="bg-black text-white hover:bg-slate-800" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account authentication and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                We use magic links for passwordless authentication, so you can't change it here.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={profile?.language || 'en'} onValueChange={val => setProfile((p: any) => ({ ...p, language: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={profile?.timezone || 'utc'} onValueChange={val => setProfile((p: any) => ({ ...p, timezone: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc-12">UTC-12:00</SelectItem>
                  <SelectItem value="utc-8">UTC-08:00 (Pacific Time)</SelectItem>
                  <SelectItem value="utc-5">UTC-05:00 (Eastern Time)</SelectItem>
                  <SelectItem value="utc">UTC+00:00 (GMT)</SelectItem>
                  <SelectItem value="utc+1">UTC+01:00 (Central European Time)</SelectItem>
                  <SelectItem value="utc+8">UTC+08:00 (China Standard Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Session Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Chrome on macOS • San Francisco, CA</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Active now</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-muted-foreground">iOS 16 • Last active 2 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how and when you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="post-published">Post Published</Label>
                <p className="text-sm text-muted-foreground">Get notified when your post is published.</p>
              </div>
              <Switch id="post-published" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="post-performance">Post Performance</Label>
                <p className="text-sm text-muted-foreground">Get notified about your post's performance.</p>
              </div>
              <Switch id="post-performance" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="login-alerts">Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts when someone logs into your account.</p>
              </div>
              <Switch id="login-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive marketing emails and promotions.</p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="bg-black text-white hover:bg-slate-800" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="integrations">
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect your account to third-party services and manage integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Coming soon: Google, Zapier, and more!</Label>
              <p className="text-sm text-muted-foreground">You'll be able to connect your account to popular services and automate your workflow.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your subscription, payment methods, and invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Current Plan</Label>
              <div className="flex items-center gap-2">
                <span className="font-medium">Free</span>
                <Button size="sm" variant="outline">Upgrade</Button>
              </div>
              <p className="text-sm text-muted-foreground">You are on the free plan. Upgrade for more features.</p>
            </div>
            <div className="space-y-2">
              <Label>Usage</Label>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-black h-full" style={{ width: "10%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground">10% of your monthly quota used.</p>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Input value="**** **** **** 4242" disabled />
              <Button size="sm" variant="outline">Update Payment Method</Button>
            </div>
            <div className="space-y-2">
              <Label>Invoices</Label>
              <Button size="sm" variant="outline">View Invoices</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
