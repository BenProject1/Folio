import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { FolioProfile, FolioLink } from '../lib/supabase'
import { THEMES } from '../data/themes'
import { recordPageView, recordLinkClick } from '../services/links'
import { Zap } from 'lucide-react'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<FolioProfile | null>(null)
  const [links, setLinks] = useState<FolioLink[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      if (!username) return
      const { data: p } = await supabase.from('folio_profiles').select('*').eq('username', username).single()
      if (!p) { setNotFound(true); setLoading(false); return }
      setProfile(p as FolioProfile)
      const { data: l } = await supabase.from('folio_links').select('*').eq('user_id', p.id).eq('is_active', true).order('position')
      setLinks((l ?? []) as FolioLink[])
      setLoading(false)
      recordPageView(p.id)
    }
    load()
  }, [username])

  async function handleLinkClick(link: FolioLink) {
    if (!profile) return
    await recordLinkClick(link.id, profile.id)
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090b' }}>
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#09090b' }}>
      <div className="text-6xl">🔍</div>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="text-zinc-400">@{username} doesn't have a Folio yet.</p>
      <a href="/login" className="btn-primary">Create yours for free →</a>
    </div>
  )

  const theme = THEMES.find(t => t.id === profile?.theme) ?? THEMES[0]
  const accentColor = profile?.accent_color ?? '#7C3AED'
  const isMinimal = theme.id === 'minimal'

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4" style={{ background: theme.bg }}>
      <div className="w-full max-w-sm space-y-4">
        {/* Avatar */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-2xl" style={{ background: accentColor }}>
            {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <h1 className="text-xl font-black mb-1" style={{ color: theme.text }}>{profile?.display_name}</h1>
          <p className="text-sm opacity-60" style={{ color: theme.text }}>@{profile?.username}</p>
          {profile?.bio && (
            <p className="text-sm mt-3 leading-relaxed opacity-70 max-w-xs mx-auto" style={{ color: theme.text }}>{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full py-3.5 px-5 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-md"
              style={{
                background: theme.card,
                color: theme.text,
                border: `1px solid ${isMinimal ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: `0 4px 20px ${accentColor}20`
              }}
            >
              <span className="text-lg">{link.icon}</span>
              {link.title}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <a href="/login" className="inline-flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity" style={{ color: theme.text }}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: accentColor }}>
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-xs font-medium">Made with Folio</span>
          </a>
        </div>
      </div>
    </div>
  )
}
