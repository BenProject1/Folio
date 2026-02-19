import { Link } from 'react-router-dom'
import { Zap, Link2, BarChart3, Palette, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div style={{ background: '#09090b', color: '#fafafa' }} className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold">Folio</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">Sign in</Link>
          <Link to="/login" className="btn-primary !h-9 !text-sm">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center px-8 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 badge badge-purple mb-6">
          <Zap size={12} /> New · Animated themes just dropped
        </div>
        <h1 className="text-6xl font-black leading-tight mb-6 max-w-3xl mx-auto">
          One link.{' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Everything you are.
          </span>
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">
          Create a stunning link-in-bio page in 30 seconds. Beautiful themes, real analytics, zero design skills needed.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/login" className="btn-primary !text-base !px-8" style={{ height: 52, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
            Create your Folio — it's free <ArrowRight size={18} />
          </Link>
        </div>
        <p className="text-zinc-600 text-sm mt-4">No credit card required · Setup in 30 seconds</p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: Link2, title: 'Unlimited links', desc: 'Add all your social profiles, websites, and content in one place.', color: '#7C3AED' },
            { icon: BarChart3, title: 'Real analytics', desc: 'See exactly who clicks what. Track views, clicks, and devices.', color: '#EC4899' },
            { icon: Palette, title: 'Beautiful themes', desc: '6 stunning themes. Customize colors to match your brand.', color: '#10B981' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card p-6 hover:scale-[1.02] transition-transform duration-200" style={{ background: '#18181b' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}20` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-2xl mx-auto px-8 py-16 text-center">
        <h2 className="text-3xl font-black text-white mb-3">Simple pricing</h2>
        <p className="text-zinc-400 mb-10">Start free. Upgrade when you're ready.</p>
        <div className="grid grid-cols-2 gap-6">
          {[
            { name: 'Free', price: '€0', color: '#27272a', features: ['5 links', 'Basic analytics', '3 themes', 'Folio branding'] },
            { name: 'Pro', price: '€9', color: 'linear-gradient(135deg, #4c1d95, #831843)', features: ['Unlimited links', 'Full analytics', 'All 6 themes', 'Custom colors', 'Remove branding', 'QR codes'] },
          ].map(({ name, price, color, features }) => (
            <div key={name} className="card p-6 text-left" style={{ background: color, border: name === 'Pro' ? '1px solid rgba(124,58,237,0.4)' : undefined }}>
              <p className="font-bold text-white mb-1">{name}</p>
              <p className="text-3xl font-black text-white mb-1">{price}<span className="text-sm font-normal text-zinc-400">/mo</span></p>
              <div className="border-t border-white/10 my-4" />
              <div className="space-y-2">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-violet-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              {name === 'Pro' && (
                <Link to="/login" className="btn-primary w-full justify-center mt-4">Get Pro</Link>
              )}
              {name === 'Free' && (
                <Link to="/login" className="btn-secondary w-full justify-center mt-4">Start free</Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center px-8 py-16">
        <h2 className="text-4xl font-black text-white mb-4">Ready to grow?</h2>
        <p className="text-zinc-400 mb-8">Join thousands of creators who share their world through Folio.</p>
        <Link to="/login" className="btn-primary !text-base !px-8" style={{ height: 52 }}>
          Create your free Folio <ArrowRight size={18} />
        </Link>
      </div>

      <div className="border-t border-zinc-900 py-8 text-center text-zinc-600 text-sm">
        © 2026 Folio. Made with ❤️
      </div>
    </div>
  )
}
