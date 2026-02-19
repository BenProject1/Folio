import { useState } from 'react'
import Modal from '../components/ui/Modal'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface Props { isOpen: boolean; onClose: () => void; username: string }

export default function ShareModal({ isOpen, onClose, username }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/${username}`

  function copyUrl() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share your Folio">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-2xl">
            <QRCodeSVG value={url} size={160} />
          </div>
        </div>
        <div>
          <label className="label">Your Folio URL</label>
          <div className="flex gap-2">
            <input className="input flex-1" value={url} readOnly />
            <button onClick={copyUrl} className="btn-primary !px-4">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center">
          <ExternalLink size={16} />
          Open my page
        </a>
      </div>
    </Modal>
  )
}
