import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) { navigate('/dashboard'); return null }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    let err: string | null = null
    if (mode === 'login') {
      err = await signIn(email, password)
    } else {
      if (!username.trim() || username.length < 3) { setError('Username must be at least 3 characters'); setLoading(false); return }
      if (!/^[a-z0-9_]+$/.test(username)) { setError('Username can only contain letters, numbers, and underscores'); setLoading(false); return }
      err = await signUp(email, password, username.toLowerCase())
    }
    setLoading(false)
    if (err) setError(err)
    else navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#09090b' }}>
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12" style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 50%, #091225 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Folio</span>
        </div>
        <div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Your link,<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              your world.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
            Create a stunning link-in-bio page. Share everything in one beautiful, customizable link.
          </p>
          <div className="flex gap-8 mt-10">
            {[['10K+', 'Creators'], ['2M+', 'Monthly visits'], ['99.9%', 'Uptime']].map(([n, l]) => (
              <div key={l}>
                <p className="text-2xl font-black text-white">{n}</p>
                <p className="text-sm text-zinc-500">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-zinc-600 text-sm">© 2026 Folio. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">Folio</span>
          </div>

          <h2 className="text-3xl font-black text-white mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your Folio'}
          </h2>
          <p className="text-zinc-400 mb-8">
            {mode === 'login' ? 'Sign in to your account' : 'Join thousands of creators'}
          </p>

          {/* Toggle */}
          <div className="flex p-1 rounded-xl mb-8" style={{ background: '#18181b' }}>
            {(['login', 'signup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Username</label>
                <div className="flex items-center gap-2 input">
                  <span className="text-zinc-500 text-sm">folio.app/</span>
                  <input className="flex-1 bg-transparent outline-none text-white text-sm" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} placeholder="yourname" style={{ border: 'none', padding: 0 }} />
                </div>
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="text-red-400 text-sm p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center !h-12 text-base">
              {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Create my Folio'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-zinc-500 text-sm mt-6">
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-violet-400 hover:text-violet-300 font-medium">Sign up free</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
