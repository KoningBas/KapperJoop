import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Calendar, CheckCircle, Clock, Scissors } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Appointment } from '../../types/database'

interface Stats {
  upcoming: number
  pending: number
  completed: number
  activeServices: number
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-slate-50 text-slate-600 border-slate-200',
}

const STATUS_NL: Record<string, string> = {
  pending: 'In behandeling',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
  completed: 'Afgerond',
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ upcoming: 0, pending: 0, completed: 0, activeServices: 0 })
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = format(new Date(), 'yyyy-MM-dd')

      const [upcoming, pending, completed, services, recent] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact' }).gte('appointment_date', today).neq('status', 'cancelled'),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('services').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('appointments').select('*, services(name)').order('appointment_date', { ascending: false }).limit(8),
      ])

      setStats({
        upcoming: upcoming.count ?? 0,
        pending: pending.count ?? 0,
        completed: completed.count ?? 0,
        activeServices: services.count ?? 0,
      })
      setRecentAppointments((recent.data as Appointment[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  const CARDS = [
    { label: 'Komende afspraken', value: stats.upcoming, icon: Calendar, color: '#C49A6C' },
    { label: 'In behandeling', value: stats.pending, icon: Clock, color: '#D4B48C' },
    { label: 'Afgerond', value: stats.completed, icon: CheckCircle, color: '#A07848' },
    { label: 'Actieve diensten', value: stats.activeServices, icon: Scissors, color: '#C49A6C' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overzicht</h1>
        <p className="text-gray-500 text-sm mt-1">{format(new Date(), 'EEEE d MMMM yyyy', { locale: nl })}</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {CARDS.map(card => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
              <div className="p-1.5 rounded" style={{ background: `${card.color}20` }}>
                <card.icon size={14} style={{ color: card.color }} />
              </div>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recente afspraken</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 animate-pulse rounded" />
            ))}
          </div>
        ) : recentAppointments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">Nog geen afspraken</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Klant</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dienst</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tijd</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentAppointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">{appt.full_name}</td>
                    <td className="px-6 py-3 text-gray-600">{appt.services?.name ?? '—'}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {format(parseISO(appt.appointment_date), 'd MMM yyyy', { locale: nl })}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{appt.start_time?.slice(0, 5)}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[appt.status]}`}>
                        {STATUS_NL[appt.status]}
                      </span>
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
