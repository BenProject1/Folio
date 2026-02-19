import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { User, Shield, CreditCard, LogOut, ExternalLink } from 'lucide-react'
import EditProfileModal from '../modals/EditProfileModal'
import UpgradeModal from '../modals/UpgradeModal'

export default function Settings() {
  const { profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [showEdit, setShowEdit] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [username, setUsername] = useState('')

  // Sync username input when profile loads or changes
  useEffect(() => {
    if (profile) setUsername(profile.username ?? '')
  }, [profile])
  const [usernameMsg, setUsernameMsg] = useState('')
  const [savingUsername, setSavingUsername] = useState(false)

  async function saveUsername() {
    if (!profile || !username.trim()) return
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      setUsernameMsg('Username must be 3-30 chars, lowercase letters, numbers, underscores only')
      return
    }
    setSavingUsername(true)
    const { error } = await supabase.from('folio_profiles').update({ username: username.toLowerCase() }).eq('id', profile.id)
    if (error) setUsernameMsg(error.message)
    else { setUsernameMsg('✓ Username updated!'); await refreshProfile() }
    setSavingUsername(false)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-4">
        {/* Profile */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <User size={18} className="text-violet-400" />
            <h3 className="font-semibold text-white">Profile</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: profile?.accent_color ?? '#7C3AED' }}>
              {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-medium text-white">{profile?.display_name}</p>
              <p className="text-sm text-zinc-400">@{profile?.username}</p>
            </div>
          </div>
          <button onClick={() => setShowEdit(true)} className="btn-secondary w-full justify-center">Edit profile, theme & colors</button>
        </div>

        {/* Username */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <ExternalLink size={18} className="text-violet-400" />
            <h3 className="font-semibold text-white">Your Folio URL</h3>
          </div>
          <label className="label">Username</label>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 input flex-1">
              <span className="text-zinc-500 text-sm whitespace-nowrap">{window.location.host}/</span>
              <input className="flex-1 bg-transparent outline-none text-white text-sm" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} style={{ border: 'none', padding: 0 }} />
            </div>
            <button onClick={saveUsername} disabled={savingUsername} className="btn-primary !px-4">Save</button>
          </div>
          {usernameMsg && <p className={`text-xs mt-2 ${usernameMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{usernameMsg}</p>}
        </div>

        {/* Plan */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard size={18} className="text-violet-400" />
            <h3 className="font-semibold text-white">Plan</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{profile?.is_pro ? 'Pro' : 'Free'} plan</p>
              <p className="text-sm text-zinc-400">{profile?.is_pro ? 'All features unlocked' : '5 links · Basic analytics'}</p>
            </div>
            {!profile?.is_pro && (
              <button onClick={() => setShowUpgrade(true)} className="btn-primary">Upgrade to Pro</button>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="card p-5 border-red-900/30">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-red-400" />
            <h3 className="font-semibold text-white">Account</h3>
          </div>
          <button onClick={handleSignOut} className="btn-danger w-full justify-center">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      <EditProfileModal isOpen={showEdit} onClose={() => setShowEdit(false)} />
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  )
}
