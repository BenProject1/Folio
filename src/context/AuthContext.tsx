import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { FolioProfile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: FolioProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string, username: string) => Promise<string | null>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<FolioProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('folio_profiles').select('*').eq('id', userId).maybeSingle()
    if (data) {
      setProfile(data as FolioProfile)
    } else {
      // Profile missing (trigger may have failed) — create it now
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const baseUsername = (user.user_metadata?.username ?? user.email?.split('@')[0] ?? 'user')
          .toLowerCase().replace(/[^a-z0-9_]/g, '')
        const fallbackUsername = baseUsername.length >= 3 ? baseUsername : `user${baseUsername}`
        const { data: newProfile } = await supabase
          .from('folio_profiles')
          .insert({
            id: userId,
            username: fallbackUsername,
            display_name: user.user_metadata?.full_name ?? user.user_metadata?.username ?? fallbackUsername
          })
          .select()
          .single()
        if (newProfile) setProfile(newProfile as FolioProfile)
      }
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  async function signUp(email: string, password: string, username: string) {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username, full_name: username } }
    })
    return error?.message ?? null
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
