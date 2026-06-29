import { X } from 'lucide-react'
import { Button } from '../../ui/Button'

interface Props {
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({ title, description, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg text-[#1A1410]">{title}</h3>
          <button
            onClick={onCancel}
            className="text-[#3D2B1F]/40 hover:text-[#3D2B1F] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-[#3D2B1F]/70 leading-relaxed font-body">{description}</p>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel} className="flex-1">
            Annuleren
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} disabled={loading} className="flex-1">
            {loading ? 'Verwijderen...' : 'Verwijderen'}
          </Button>
        </div>
      </div>
    </div>
  )
}
