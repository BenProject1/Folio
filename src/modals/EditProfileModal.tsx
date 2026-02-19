import { useState, useEffect } from 'react'
import Modal from '../components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import { THEMES } from '../data/themes'

interface Props { isOpen: boolean; onClose: () => void }

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { profile, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [theme, setTheme] = useState('midnight')
  const [accentColor, setAccentColor] = useState('#7C3AED')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sync form state whenever the modal opens or profile changes
  useEffect(() => {
    if (isOpen && profile) {
      setDisplayName(profile.display_name ?? '')
      setBio(profile.bio ?? '')
      setTheme(profile.theme ?? 'midnight')
      setAccentColor(profile.accent_color ?? '#7C3AED')
      setSaved(false)
    }
  }, [isOpen, profile])

  async function handleSave() {
    if (!profile) return
    setLoading(true)
    const { error } = await supabase
      .from('folio_profiles')
      .update({ display_name: displayName, bio, theme, accent_color: accentColor, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    if (!error) {
      await refreshProfile()
      toast('Profil mis à jour !')
      setSaved(true)
      setTimeout(() => { setSaved(false); onClose() }, 800)
    } else {
      toast('Erreur lors de la sauvegarde', 'error')
    }
    setLoading(false)
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
