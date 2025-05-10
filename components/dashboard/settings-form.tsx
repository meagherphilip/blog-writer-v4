"use client"

import { useState } from "react"
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

export function SettingsForm() {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [email, setEmail] = useState("john.doe@example.com")

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleSendMagicLink = () => {
    setMagicLinkSent(true)
    setTimeout(() => {
      setMagicLinkSent(false)
    }, 5000)
  }

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
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
                <AvatarImage src="/avatar.png" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Change avatar
                </Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                defaultValue="Content creator and digital marketing specialist with over 5 years of experience."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue="https://johndoe.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue="Acme Inc." />
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
                />
                <Button variant="outline" onClick={handleSendMagicLink} disabled={magicLinkSent}>
                  {magicLinkSent ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Sent
                    </>
                  ) : (
                    "Send Magic Link"
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                We use magic links for passwordless authentication. A login link will be sent to this email.
              </p>
            </div>

            {magicLinkSent && (
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  A magic link has been sent to {email}. Check your inbox to verify your email.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
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
              <Select defaultValue="utc-8">
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

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Manage your API keys and integration settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex">
                <Input
                  id="api-key"
                  defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  type="password"
                  className="rounded-r-none"
                />
                <Button variant="outline" className="rounded-l-none">
                  Reveal
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your API key has full access to your account. Keep it secure.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input id="webhook-url" placeholder="https://your-app.com/webhook" />
              <p className="text-sm text-muted-foreground">We'll send post-generation events to this URL.</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="api-access">Enable API Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow external applications to access your account via API.
                </p>
              </div>
              <Switch id="api-access" defaultChecked />
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">API Usage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Requests this month</span>
                  <span className="font-medium">1,234 / 5,000</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-black h-full" style={{ width: "25%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Your plan resets on May 31, 2025</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="text-red-600">
              Regenerate API Key
            </Button>
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
    </Tabs>
  )
}
