import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, Phone, Mail, FileText, Edit2, Trash2, Check, X } from 'lucide-react'
import type { Appointment } from '../../../types/database'
import { getKapper } from '../../../config/kappers'
import { Button } from '../../ui/Button'

interface Props {
  appointment: Appointment
  showActions?: 'accept-reject' | 'edit-delete' | 'none'
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onEdit?: (appointment: Appointment) => void
  onDelete?: (id: string) => void
  defaultExpanded?: boolean
}

export default function AppointmentCard({
  appointment: a,
  showActions = 'edit-delete',
  onAccept,
  onReject,
  onEdit,
  onDelete,
  defaultExpanded = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const kapper = getKapper(a.kapper_id)
  const serviceName = (a.services as any)?.name ?? 'Onbekende dienst'

  return (
    <div className="bg-white rounded-xl border border-[#C49A6C]/15 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#F5F0E8]/50 transition-colors"
      >
        <div
          className="w-2.5 h-10 rounded-full flex-shrink-0"
          style={{ backgroundColor: kapper.colorHex }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-label text-xs uppercase tracking-wider text-[#3D2B1F]/50">
              {kapper.name}
            </span>
            <span className="text-[#C49A6C]/40">·</span>
            <span className="font-label text-xs uppercase tracking-wider text-[#3D2B1F]/50 truncate">
              {serviceName}
            </span>
          </div>
          <span className="font-body font-semibold text-[#1A1410] block mt-0.5 truncate">
            {a.full_name}
          </span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 text-[#3D2B1F]/60 text-sm font-label">
            <Clock size={13} />
            <span>{a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)}</span>
          </div>
          <div className="text-xs text-[#3D2B1F]/40 mt-0.5">{a.appointment_date}</div>
        </div>
        <div className="ml-2 text-[#C49A6C]/60">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#C49A6C]/10 p-4 space-y-3 bg-[#FDFAF5]">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Detail icon={<Phone size={13} />} label="Telefoon" value={a.phone} />
            <Detail icon={<Mail size={13} />} label="E-mail" value={a.email} />
            {a.notes && (
              <Detail
                icon={<FileText size={13} />}
                label="Notities"
                value={a.notes}
                className="col-span-2"
              />
            )}
          </div>

          {showActions !== 'none' && (
            <div className="flex gap-2 pt-1">
              {showActions === 'accept-reject' && (
                <>
                  <Button
                    variant="copper"
                    size="sm"
                    onClick={() => onAccept?.(a.id)}
                    className="flex items-center gap-1.5"
                  >
                    <Check size={14} /> Accepteren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject?.(a.id)}
                    className="flex items-center gap-1.5 !text-red-700 !border-red-200 hover:!bg-red-50"
                  >
                    <X size={14} /> Afwijzen
                  </Button>
                </>
              )}
              {showActions === 'edit-delete' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(a)}
                    className="flex items-center gap-1.5"
                  >
                    <Edit2 size={14} /> Bewerken
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete?.(a.id)}
                    className="flex items-center gap-1.5"
                  >
                    <Trash2 size={14} /> Verwijderen
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Detail({
  icon,
  label,
  value,
  className = '',
}: {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="flex items-center gap-1 text-[#3D2B1F]/40 text-xs font-label uppercase tracking-wider">
        {icon} {label}
      </span>
      <span className="text-[#3D2B1F] text-sm font-body">{value}</span>
    </div>
  )
}
