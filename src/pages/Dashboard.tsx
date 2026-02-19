import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLinks, getAnalytics } from '../services/links'
import type { FolioLink } from '../lib/supabase'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Link2, Eye, MousePointerClick, TrendingUp, ArrowRight, Share2, Edit3 } from 'lucide-react'
import ShareModal from '../modals/ShareModal'
import EditProfileModal from '../modals/EditProfileModal'

export default function Dashboard() {
  const { profile } = useAuth()
  const [links, setLinks] = useState<FolioLink[]>([])
  const [analytics, setAnalytics] = useState<{ views: {viewed_at: string}[]; clicks: {clicked_at: string}[]; topLinks: {id: string; title: string; click_count: number}[] }>({ views: [], clicks: [], topLinks: [] })
  const [showShare, setShowShare] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!profile) return
    getLinks(profile.id).then(setLinks)
    getAnalytics(profile.id).then(setAnalytics)
  }, [profile])

  // Build last 7 days chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en', { weekday: 'short' })
    const views = analytics.views.filter(v => v.viewed_at.slice(0, 10) === dateStr).length
    const clicks = analytics.clicks.filter(c => c.clicked_at.slice(0, 10) === dateStr).length
    return { label, views, clicks }
  })

  const totalViews = analytics.views.length
  const totalClicks = analytics.clicks.length
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey {profile?.display_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-zinc-400 mt-1">Here's what's happening with your Folio</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowEdit(true)} className="btn-secondary">
            <Edit3 size={16} /> Edit profile
          </button>
          <button onClick={() => setShowShare(true)} className="btn-primary">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total views', value: totalViews, icon: Eye, color: '#7C3AED' },
          { label: 'Total clicks', value: totalClicks, icon: MousePointerClick, color: '#EC4899' },
          { label: 'Click rate', value: `${ctr}%`, icon: TrendingUp, color: '#10B981' },
          { label: 'Active links', value: links.filter(l => l.is_active).length, icon: Link2, color: '#F59E0B' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">{label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="stat-number">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Views & Clicks — last 7 days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="#52525b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#52525b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, color: '#fafafa' }} />
              <Area type="monotone" dataKey="views" stroke="#7C3AED" fill="url(#gViews)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="#EC4899" fill="url(#gClicks)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top links */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">Top links</h3>
            <Link to="/analytics" className="text-xs text-violet-400 hover:text-violet-300">See all →</Link>
          </div>
          {analytics.topLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-600">
              <MousePointerClick size={24} className="mb-2" />
              <p className="text-sm">No clicks yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.topLinks.map((link, i) => (
                <div key={link.id} className="flex items-center gap-3">
                  <span className="text-zinc-600 text-xs w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{link.title}</p>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">{link.click_count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {links.length === 0 && (
        <div className="card p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.05))' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <Link2 size={28} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Add your first link</h3>
          <p className="text-zinc-400 text-sm mb-5">Start building your Folio by adding links to your content</p>
          <Link to="/editor" className="btn-primary inline-flex"><ArrowRight size={16} />Go to editor</Link>
        </div>
      )}

      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} username={profile?.username ?? ''} />
      <EditProfileModal isOpen={showEdit} onClose={() => setShowEdit(false)} />
    </div>
  )
}
