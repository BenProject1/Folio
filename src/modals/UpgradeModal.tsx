import Modal from '../components/ui/Modal'
import { Sparkles, Check } from 'lucide-react'

interface Props { isOpen: boolean; onClose: () => void }

const features = [
  'Unlimited links', 'Premium themes & animations', 'Detailed analytics & heatmaps',
  'Custom domain support', 'Remove Folio branding', 'Priority support', 'QR code downloads'
]

export default function UpgradeModal({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Pro" size="sm">
      <div className="space-y-5">
        <div className="text-center py-2">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            <Sparkles size={28} className="text-white" />
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-white">€9</span>
            <span className="text-zinc-400">/month</span>
          </div>
          <p className="text-zinc-400 text-sm mt-1">Cancel anytime</p>
        </div>
        <div className="space-y-2">
          {features.map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.2)' }}>
                <Check size={12} className="text-violet-400" />
              </div>
              <span className="text-sm text-zinc-300">{f}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
          <Sparkles size={16} />
          Start Pro — €9/month
        </button>
        <button onClick={onClose} className="btn-ghost w-full justify-center text-zinc-500">Maybe later</button>
      </div>
    </Modal>
  )
}
