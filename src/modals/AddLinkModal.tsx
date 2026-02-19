import { useState } from 'react'
import Modal from '../components/ui/Modal'
import { LINK_TYPES } from '../data/themes'
import { addLink, updateLink } from '../services/links'
import { useAuth } from '../context/AuthContext'
import type { FolioLink } from '../lib/supabase'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editLink?: FolioLink | null
}

export default function AddLinkModal({ isOpen, onClose, onSuccess, editLink }: Props) {
  const { user } = useAuth()
  const [title, setTitle] = useState(editLink?.title ?? '')
  const [url, setUrl] = useState(editLink?.url ?? '')
  const [icon, setIcon] = useState(editLink?.icon ?? '🔗')
  const [type, setType] = useState(editLink?.type ?? 'link')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useState(() => {
    if (editLink) {
      setTitle(editLink.title)
      setUrl(editLink.url)
      setIcon(editLink.icon)
      setType(editLink.type)
    } else {
      setTitle(''); setUrl(''); setIcon('🔗'); setType('link')
    }
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!title.trim() || !url.trim()) { setError('Title and URL are required'); return }
    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http') && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('tel:')) {
      finalUrl = 'https://' + finalUrl
    }
    setLoading(true); setError('')
    try {
      if (editLink) {
        await updateLink(editLink.id, { title: title.trim(), url: finalUrl, icon, type })
      } else {
        await addLink(user.id, { title: title.trim(), url: finalUrl, icon, type })
      }
      onSuccess(); onClose()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function selectType(t: typeof LINK_TYPES[0]) {
    setType(t.id); setIcon(t.icon)
    if (!title) setTitle(t.label)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editLink ? 'Edit link' : 'Add a new link'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type selector */}
        <div>
          <label className="label">Platform</label>
          <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
            {LINK_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => selectType(t)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  type === t.id ? 'border-violet-500 bg-violet-600/20 text-violet-300' : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}>
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="My website" />
        </div>
        <div>
          <label className="label">URL</label>
          <input className="input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving...' : editLink ? 'Save changes' : 'Add link'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
