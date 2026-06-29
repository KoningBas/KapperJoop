import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Appointment } from '../../types/database'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { Calendar, Phone, Mail, Check, X, CheckCheck } from 'lucide-react'

const STATUSES = ['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const
type StatusFilter = typeof STATUSES[number]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-slate-50 text-slate-600 border-slate-200',
}

const STATUS_NL: Record<string, string> = {
  pending: 'In behandeling',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
  completed: 'Afgerond',
  all: 'Alle',
}


export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    let query = supabase
      .from('appointments')
      .select('*, services(name)')
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: true })

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    setAppointments((data as Appointment[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as Appointment['status'] } : a))
    setUpdating(null)
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Afspraken</h1>
          <p className="text-gray-500 text-sm mt-1">{appointments.length} afspraken gevonden</p>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                filter === s
                  ? 'bg-[#C49A6C] text-[#1A1410] border-[#C49A6C]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {STATUS_NL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">Geen afspraken gevonden</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Klant', 'Dienst', 'Datum & Tijd', 'Telefoon', 'E-mail', 'Status', 'Acties', 'Opmerking'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{appt.full_name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{appt.services?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <div>{format(parseISO(appt.appointment_date), 'd MMM yyyy', { locale: nl })}</div>
                      <div className="text-xs text-gray-400">{appt.start_time?.slice(0, 5)} – {appt.end_time?.slice(0, 5)}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a href={`tel:${appt.phone}`} className="flex items-center gap-1 hover:text-[#C49A6C] transition-colors whitespace-nowrap">
                        <Phone size={12} /> {appt.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a href={`mailto:${appt.email}`} className="flex items-center gap-1 hover:text-[#C49A6C] transition-colors">
                        <Mail size={12} />
                        <span className="max-w-[140px] truncate">{appt.email}</span>
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-xs font-medium border rounded px-2 py-1 ${STATUS_COLORS[appt.status]}`}>
                        {STATUS_NL[appt.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {appt.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(appt.id, 'confirmed')}
                            disabled={updating === appt.id}
                            title="Bevestig afspraak"
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          >
                            <Check size={12} />
                            Bevestig
                          </button>
                        )}
                        {appt.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(appt.id, 'completed')}
                            disabled={updating === appt.id}
                            title="Markeer als afgerond"
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50 transition-colors"
                          >
                            <CheckCheck size={12} />
                            Afgerond
                          </button>
                        )}
                        {(appt.status === 'pending' || appt.status === 'confirmed') && (
                          <button
                            onClick={() => updateStatus(appt.id, 'cancelled')}
                            disabled={updating === appt.id}
                            title="Annuleer afspraak"
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white text-red-600 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
                          >
                            <X size={12} />
                            Annuleer
                          </button>
                        )}
                        {(appt.status === 'cancelled' || appt.status === 'completed') && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px] truncate">
                      {appt.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
