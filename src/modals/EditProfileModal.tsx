import { useState } from 'react'
import Modal from '../components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { THEMES } from '../data/themes'

interface Props { isOpen: boolean; onClose: () => void }

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { profile, refreshProfile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [theme, setTheme] = useState(profile?.theme ?? 'midnight')
  const [accentColor, setAccentColor] = useState(profile?.accent_color ?? '#7C3AED')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!profile) return
    setLoading(true)
    await supabase.from('folio_profiles').update({ display_name: displayName, bio, theme, accent_color: accentColor, updated_at: new Date().toISOString() }).eq('id', profile.id)
    await refreshProfile()
    setLoading(false); setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit profile" size="lg">
      <div className="space-y-5">
        <div>
          <label className="label">Display name</label>
          <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea className="input resize-none h-24" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the world about yourself..." />
        </div>

        <div>
          <label className="label">Page theme</label>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(t => (
              <button key={t.id} type="button" onClick={() => setTheme(t.id)}
                className={`relative p-3 rounded-xl border transition-all ${theme === t.id ? 'border-violet-500' : 'border-zinc-800 hover:border-zinc-700'}`}>
                <div className={`h-10 rounded-lg bg-gradient-to-br ${t.preview} mb-2`} />
                <p className="text-xs font-medium text-zinc-300">{t.name}</p>
                {theme === t.id && <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Accent color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-10 h-10 rounded-lg border border-zinc-700 cursor-pointer bg-transparent" />
            <input className="input flex-1" value={accentColor} onChange={e => setAccentColor(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="btn-primary flex-1">
            {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
