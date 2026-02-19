import { Link } from 'react-router-dom'
import { Sparkles, Check, ArrowLeft } from 'lucide-react'

const features = [
  'Unlimited links', 'Detailed analytics + device breakdown', 'All 6 premium themes',
  'Custom accent colors', 'Remove "Made with Folio" branding', 'QR code download',
  'Priority email support'
]

export default function Upgrade() {
  return (
    <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
      <div className="max-w-md w-full">
        <Link to="/dashboard" className="btn-ghost mb-8 inline-flex"><ArrowLeft size={16} />Back to dashboard</Link>
        <div className="card p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.05))' }}>
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <Sparkles size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Folio Pro</h1>
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="text-5xl font-black text-white">€9</span>
            <span className="text-zinc-400">/month</span>
          </div>
          <p className="text-zinc-400 text-sm mb-8">Cancel anytime. No commitment.</p>
          <div className="space-y-3 text-left mb-8">
            {features.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-violet-600/30">
                  <Check size={12} className="text-violet-400" />
                </div>
                <span className="text-sm text-zinc-300">{f}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full justify-center !h-12 text-base" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
            <Sparkles size={18} /> Start Pro — €9/month
          </button>
          <p className="text-zinc-600 text-xs mt-3">Secure payment · Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
