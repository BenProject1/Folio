import Modal from '../components/ui/Modal'
import { Trash2 } from 'lucide-react'
import { deleteLink } from '../services/links'

interface Props {
  isOpen: boolean; onClose: () => void
  linkId: string | null; linkTitle: string
  onSuccess: () => void
}

export default function DeleteLinkModal({ isOpen, onClose, linkId, linkTitle, onSuccess }: Props) {
  async function handleDelete() {
    if (!linkId) return
    await deleteLink(linkId)
    onSuccess(); onClose()
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete link" size="sm">
      <div className="space-y-5">
        <p className="text-zinc-400 text-sm">Are you sure you want to delete <span className="text-white font-medium">"{linkTitle}"</span>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} className="btn-danger flex-1"><Trash2 size={16} />Delete</button>
        </div>
      </div>
    </Modal>
  )
}
