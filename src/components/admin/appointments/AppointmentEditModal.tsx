import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import { KAPPERS } from '../../../config/kappers'
import type { Appointment } from '../../../types/database'

interface Props {
  appointment: Appointment
  onSave: (
    patch: Partial<Pick<Appointment, 'appointment_date' | 'start_time' | 'end_time' | 'kapper_id' | 'notes'>>
  ) => Promise<unknown>
  onClose: () => void
}

export default function AppointmentEditModal({ appointment, onSave, onClose }: Props) {
  const [date, setDate] = useState(appointment.appointment_date)
  const [startTime, setStartTime] = useState(appointment.start_time.slice(0, 5))
  const [endTime, setEndTime] = useState(appointment.end_time.slice(0, 5))
  const [kapperId, setKapperId] = useState(appointment.kapper_id)
  const [notes, setNotes] = useState(appointment.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!date || !startTime || !endTime) {
      setError('Datum en tijden zijn verplicht.')
      return
    }
    setSaving(true)
    setError(null)
    const err = await onSave({
      appointment_date: date,
      start_time: startTime + ':00',
      end_time: endTime + ':00',
      kapper_id: kapperId,
      notes: notes || null,
    })
    setSaving(false)
    if (!err) onClose()
    else setError('Opslaan mislukt. Probeer opnieuw.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-xl text-[#1A1410]">Afspraak bewerken</h3>
          <button
            onClick={onClose}
            className="text-[#3D2B1F]/40 hover:text-[#3D2B1F] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-4">
          <Input
            label="Datum"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Begintijd"
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
            <Input
              label="Eindtijd"
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-label uppercase tracking-wider text-[#3D2B1F]/60 mb-2">
              Kapper
            </label>
            <div className="flex gap-2">
              {KAPPERS.map(k => (
                <button
                  key={k.id}
                  onClick={() => setKapperId(k.id)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-label transition-[border-color,background-color] ${
                    kapperId === k.id
                      ? 'border-[#C49A6C] bg-[#C49A6C]/10 text-[#1A1410]'
                      : 'border-[#C49A6C]/20 text-[#3D2B1F]/60 hover:border-[#C49A6C]/50'
                  }`}
                >
                  {k.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-label uppercase tracking-wider text-[#3D2B1F]/60 mb-1">
              Notities
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#C49A6C]/35 px-3 py-2 text-sm text-[#3D2B1F] font-body focus:outline-none focus:ring-2 focus:ring-[#C49A6C]/40 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
            Annuleren
          </Button>
          <Button variant="copper" size="sm" onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </div>
    </div>
  )
}
