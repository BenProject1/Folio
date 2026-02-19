import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Link2, BarChart3, Settings, LogOut, Sparkles, ExternalLink, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/editor', icon: Link2, label: 'My Links' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#0f0f12', borderRight: '1px solid #1c1c1f' }}>
      {/* Logo */}
      <div className="p-6 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Folio</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`
          }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile + actions */}
      <div className="p-4 space-y-2 border-t border-zinc-900">
        {profile && !profile.is_pro && (
          <NavLink to="/upgrade" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600/20 to-pink-600/20 text-violet-300 border border-violet-500/20 hover:border-violet-500/40 transition-all">
            <Sparkles size={16} />
            Upgrade to Pro
          </NavLink>
        )}
        {profile && (
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            <ExternalLink size={16} />
            View my page
          </a>
        )}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{profile?.display_name}</p>
            <p className="text-xs text-zinc-500 truncate">@{profile?.username}</p>
          </div>
          <button onClick={handleSignOut} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
