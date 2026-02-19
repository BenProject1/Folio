import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getLinks, updateLink, reorderLinks } from '../services/links'
import type { FolioLink } from '../lib/supabase'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, GripVertical, Edit2, Trash2, Eye, EyeOff, ExternalLink, Share2 } from 'lucide-react'
import AddLinkModal from '../modals/AddLinkModal'
import DeleteLinkModal from '../modals/DeleteLinkModal'
import ShareModal from '../modals/ShareModal'
import { THEMES } from '../data/themes'

function SortableLink({ link, onEdit, onDelete, onToggle }: {
  link: FolioLink
  onEdit: (l: FolioLink) => void
  onDelete: (id: string, title: string) => void
  onToggle: (l: FolioLink) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style} className={`card p-4 flex items-center gap-4 ${!link.is_active ? 'opacity-50' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors">
        <GripVertical size={18} />
      </div>
      <span className="text-2xl">{link.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-zinc-200 text-sm truncate">{link.title}</p>
        <p className="text-xs text-zinc-500 truncate">{link.url}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-zinc-500 mr-2 font-mono">{link.click_count} clicks</span>
        <button onClick={() => onToggle(link)} className="btn-ghost !px-2 !h-8 !w-8">
          {link.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-2 !h-8 !w-8 flex items-center justify-center">
          <ExternalLink size={15} />
        </a>
        <button onClick={() => onEdit(link)} className="btn-ghost !px-2 !h-8 !w-8"><Edit2 size={15} /></button>
        <button onClick={() => onDelete(link.id, link.title)} className="btn-ghost !px-2 !h-8 !w-8 text-red-500 hover:text-red-400"><Trash2 size={15} /></button>
      </div>
    </div>
  )
}

export default function Editor() {
  const { profile } = useAuth()
  const [links, setLinks] = useState<FolioLink[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [editLink, setEditLink] = useState<FolioLink | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteTitle, setDeleteTitle] = useState('')
  const [showShare, setShowShare] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  const theme = THEMES.find(t => t.id === (profile?.theme ?? 'midnight')) ?? THEMES[0]

  const loadLinks = useCallback(async () => {
    if (!profile) return
    const data = await getLinks(profile.id)
    setLinks(data)
  }, [profile])

  useEffect(() => { loadLinks() }, [loadLinks])

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = links.findIndex(l => l.id === active.id)
    const newIndex = links.findIndex(l => l.id === over.id)
    const reordered = arrayMove(links, oldIndex, newIndex).map((l, i) => ({ ...l, position: i }))
    setLinks(reordered)
    await reorderLinks(reordered.map(l => ({ id: l.id, position: l.position })))
  }

  async function handleToggle(link: FolioLink) {
    await updateLink(link.id, { is_active: !link.is_active })
    loadLinks()
  }

  function handleDelete(id: string, title: string) { setDeleteId(id); setDeleteTitle(title) }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left — editor */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Links</h1>
            <p className="text-zinc-400 mt-1">Drag to reorder · Click eye to hide</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowShare(true)} className="btn-secondary"><Share2 size={16} />Share</button>
            <button onClick={() => { setEditLink(null); setShowAdd(true) }} className="btn-primary"><Plus size={16} />Add link</button>
          </div>
        </div>

        {links.length === 0 ? (
          <div className="card p-12 text-center border-dashed border-zinc-700">
            <p className="text-zinc-500 mb-4">No links yet</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus size={16} />Add your first link</button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {links.map(link => (
                  <SortableLink key={link.id} link={link} onEdit={l => { setEditLink(l); setShowAdd(true) }} onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Right — live preview */}
      <div className="w-80 border-l border-zinc-900 p-6 flex flex-col items-center" style={{ background: '#0f0f12' }}>
        <p className="text-xs text-zinc-500 font-medium mb-4 uppercase tracking-wider">Live preview</p>
        <div className="w-56 rounded-[40px] overflow-hidden shadow-2xl" style={{ border: '8px solid #1a1a1f', background: theme.bg }}>
          <div className="p-5" style={{ background: theme.bg }}>
            {/* Profile section */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold" style={{ background: profile?.accent_color ?? '#7C3AED' }}>
                {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <p className="font-bold text-sm" style={{ color: theme.text }}>{profile?.display_name}</p>
              <p className="text-xs opacity-60 mt-0.5" style={{ color: theme.text }}>@{profile?.username}</p>
              {profile?.bio && <p className="text-xs opacity-50 mt-1 leading-relaxed" style={{ color: theme.text }}>{profile.bio.slice(0, 60)}{profile.bio.length > 60 ? '...' : ''}</p>}
            </div>
            {/* Links preview */}
            <div className="space-y-2">
              {links.filter(l => l.is_active).slice(0, 5).map(link => (
                <div key={link.id} className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold" style={{ background: theme.card, color: theme.text }}>
                  {link.icon} {link.title}
                </div>
              ))}
              {links.filter(l => l.is_active).length === 0 && (
                <div className="py-2.5 px-3 rounded-xl text-center text-xs" style={{ background: theme.card, color: theme.text, opacity: 0.4 }}>
                  Add links to see preview
                </div>
              )}
            </div>
          </div>
        </div>
        <a href={`/${profile?.username}`} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-4 text-xs">
          <ExternalLink size={13} /> Open full page
        </a>
      </div>

      <AddLinkModal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditLink(null) }} onSuccess={loadLinks} editLink={editLink} />
      <DeleteLinkModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} linkId={deleteId} linkTitle={deleteTitle} onSuccess={loadLinks} />
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} username={profile?.username ?? ''} />
    </div>
  )
}
