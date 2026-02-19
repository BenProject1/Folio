import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface FolioProfile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  theme: string
  accent_color: string
  is_pro: boolean
  total_views: number
  created_at: string
}

export interface FolioLink {
  id: string
  user_id: string
  title: string
  url: string
  icon: string
  type: string
  is_active: boolean
  position: number
  click_count: number
  thumbnail_url: string | null
  created_at: string
}
