"use client"

import { CreditCard, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useSession } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export function UserHeaderInfo() {
  const session = useSession()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!session) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (data) setProfile(data)
    }
    fetchProfile()
  }, [session])

  const name = profile?.name || 'User'
  const avatarUrl = profile?.avatar_url || '/avatar.png'
  const plan = profile?.plan || 'Free Plan'

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end mr-2">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{plan}</span>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export function UserNav() {
  const session = useSession();
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      if (!session) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (data) setProfile(data);
    }
    fetchProfile();
  }, [session]);

  const name = profile?.name || 'User';
  const avatarUrl = profile?.avatar_url || '/avatar.png';
  const plan = profile?.plan || 'Free Plan';
  const email = session?.user?.email || '';

  const handleNav = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-full justify-end gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-end text-sm text-right">
            <span className="font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{plan}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 items-end text-right">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNav('/dashboard/settings#profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNav('/dashboard/settings#billing')}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNav('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
