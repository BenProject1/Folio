import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export interface ToastData {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastProps {
  toasts: ToastData[]
  remove: (id: number) => void
}

export function ToastContainer({ toasts, remove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} remove={remove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, remove }: { toast: ToastData; remove: (id: number) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))
    // Auto-remove after 3s
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => remove(toast.id), 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [toast.id, remove])

  const isSuccess = toast.type === 'success'

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300"
      style={{
        background: isSuccess ? '#052e16' : '#1c0a0a',
        borderColor: isSuccess ? '#166534' : '#7f1d1d',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        minWidth: 220
      }}
    >
      {isSuccess
        ? <CheckCircle size={18} className="text-green-400 shrink-0" />
        : <XCircle size={18} className="text-red-400 shrink-0" />
      }
      <p className="text-sm font-medium flex-1" style={{ color: isSuccess ? '#86efac' : '#fca5a5' }}>
        {toast.message}
      </p>
      <button onClick={() => remove(toast.id)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}
