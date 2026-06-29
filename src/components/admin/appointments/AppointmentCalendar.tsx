import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfWeek, isToday, addWeeks, subWeeks } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Appointment } from '../../../types/database'
import { KAPPERS } from '../../../config/kappers'
import AppointmentCard from './AppointmentCard'

type ViewMode = 'dag' | 'week'

const HOUR_W = 112     // px per uur — breedte per uur in de tijdlijn
const ROW_H = 100      // px per kapper-rij
const T_START = 8 * 60 // 8:00 in minuten
const T_END = 19 * 60  // 19:00
const HOURS = Array.from({ length: T_END / 60 - T_START / 60 }, (_, i) => i + T_START / 60)

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

interface Props {
  appointments: Appointment[]
  onEdit: (a: Appointment) => void
  onDelete: (id: string) => void
}

export default function AppointmentCalendar({ appointments, onEdit, onDelete }: Props) {
  const [view, setView] = useState<ViewMode>('dag')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i))

  function navigate(dir: 1 | -1) {
    if (view === 'week') setSelectedDate(d => dir === 1 ? addWeeks(d, 1) : subWeeks(d, 1))
    else setSelectedDate(d => addDays(d, dir))
  }

  function getAppts(dateStr: string, kapperId?: string) {
    return appointments.filter(a =>
      a.appointment_date === dateStr && (!kapperId || a.kapper_id === kapperId)
    )
  }

  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const expandedAppt = expandedId ? appointments.find(a => a.id === expandedId) : null
  const totalWidth = HOURS.length * HOUR_W

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex rounded-lg border border-[#C49A6C]/25 overflow-hidden">
          {(['dag', 'week'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 text-xs font-label uppercase tracking-wider transition-colors ${
                view === v ? 'bg-[#C49A6C] text-white' : 'text-[#3D2B1F]/60 hover:bg-[#C49A6C]/10'
              }`}>
              {v}
            </button>
          ))}
        </div>

        <button onClick={() => setSelectedDate(new Date())}
          className="px-3 py-1.5 text-xs font-label uppercase tracking-wider border border-[#C49A6C]/25 rounded-lg text-[#3D2B1F]/60 hover:bg-[#C49A6C]/10 transition-colors">
          Vandaag
        </button>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-[#C49A6C]/10 text-[#3D2B1F]/60 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-label text-[#3D2B1F] min-w-[220px] text-center capitalize">
            {view === 'week'
              ? `${format(weekStart, 'd MMM', { locale: nl })} – ${format(weekDays[5], 'd MMM yyyy', { locale: nl })}`
              : format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
          </span>
          <button onClick={() => navigate(1)}
            className="p-1.5 rounded-lg hover:bg-[#C49A6C]/10 text-[#3D2B1F]/60 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex gap-4 ml-auto">
          {KAPPERS.map(k => (
            <div key={k.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: k.colorHex }} />
              <span className="text-xs font-label text-[#3D2B1F]/60">{k.name}</span>
            </div>
          ))}
        </div>
      </div>

      {view === 'dag' ? (
        /* ─── DAGVIEW: horizontale tijdlijn per kapper ─── */
        <div className="border border-[#C49A6C]/15 rounded-xl bg-white shadow-sm overflow-hidden">
          {/* Tijdas header */}
          <div className="flex border-b border-[#C49A6C]/10 bg-[#FDFAF5]">
            <div className="w-28 flex-shrink-0 border-r border-[#C49A6C]/10 px-4 py-2 flex items-center">
              <span className="text-[10px] font-label uppercase tracking-wider text-[#3D2B1F]/30">Kapper</span>
            </div>
            <div className="overflow-x-auto flex-1">
              <div className="flex" style={{ minWidth: totalWidth }}>
                {HOURS.map(h => (
                  <div key={h} style={{ width: HOUR_W, flexShrink: 0 }}
                    className="border-r border-[#C49A6C]/10 last:border-r-0 py-2 px-2">
                    <span className="text-[11px] font-label text-[#3D2B1F]/40 tabular-nums">{h}:00</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kapper-rijen */}
          {KAPPERS.map((k, ki) => {
            const appts = getAppts(dateStr, k.id)
            return (
              <div key={k.id}
                className={`flex border-b border-[#C49A6C]/10 last:border-b-0 ${ki % 2 === 1 ? 'bg-[#FDFAF5]/50' : ''}`}
                style={{ minHeight: ROW_H }}>
                {/* Label */}
                <div className="w-28 flex-shrink-0 border-r border-[#C49A6C]/10 flex flex-col justify-center px-4 py-3 gap-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: k.colorHex }} />
                    <span className="text-sm font-label font-semibold text-[#1A1410]">{k.name}</span>
                  </div>
                  <span className="text-[11px] font-label text-[#3D2B1F]/35 pl-4">
                    {appts.length} {appts.length === 1 ? 'afspraak' : 'afspraken'}
                  </span>
                </div>

                {/* Tijdlijn */}
                <div className="flex-1 overflow-x-auto">
                  <div className="relative" style={{ height: ROW_H, minWidth: totalWidth }}>
                    {/* Uur-grid */}
                    {HOURS.map(h => (
                      <div key={h}
                        className="absolute top-0 bottom-0 border-r border-[#C49A6C]/8"
                        style={{ left: (h - T_START / 60) * HOUR_W, width: HOUR_W }} />
                    ))}

                    {/* Afspraken */}
                    {appts.map(a => {
                      const left = ((toMin(a.start_time) - T_START) / 60) * HOUR_W
                      const dur = toMin(a.end_time) - toMin(a.start_time)
                      const width = Math.max((dur / 60) * HOUR_W - 4, 36)
                      const svc = (a.services as { name?: string })?.name ?? ''
                      const firstName = a.full_name.split(' ')[0]
                      // Adaptief: toon meer naarmate het blok breder is
                      const showFullName = width >= 100
                      const showFirstName = width >= 56
                      const showService = svc && width >= 130 && dur >= 45
                      return (
                        <button
                          key={a.id}
                          onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          className="absolute top-2 bottom-2 rounded-lg text-left overflow-hidden transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shadow-sm"
                          style={{ left: left + 2, width, backgroundColor: k.colorHex + 'E8' }}
                        >
                          <div className="h-full px-2 py-1.5 flex flex-col justify-center gap-0.5">
                            <div className="text-[10px] font-label font-semibold text-white/70 leading-none tabular-nums whitespace-nowrap">
                              {a.start_time.slice(0, 5)}–{a.end_time.slice(0, 5)}
                            </div>
                            {showFirstName && (
                              <div className="text-[13px] font-body font-semibold text-white leading-tight whitespace-nowrap overflow-hidden">
                                {showFullName ? a.full_name : firstName}
                              </div>
                            )}
                            {showService && (
                              <div className="text-[10px] text-white/65 whitespace-nowrap overflow-hidden">{svc}</div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ─── WEEKVIEW: 6 dag-kaarten ─── */
        <div className="grid grid-cols-6 gap-3">
          {weekDays.map(day => {
            const ds = format(day, 'yyyy-MM-dd')
            const total = getAppts(ds).length
            const today_ = isToday(day)
            return (
              <button
                key={day.toISOString()}
                onClick={() => { setSelectedDate(day); setView('dag') }}
                className={`rounded-xl border text-left p-4 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C49A6C] ${
                  today_
                    ? 'border-[#C49A6C] bg-[#C49A6C]/5 shadow-sm'
                    : 'border-[#C49A6C]/15 bg-white hover:border-[#C49A6C]/40'
                }`}
              >
                <div className="mb-3">
                  <div className="text-[10px] font-label uppercase tracking-wider text-[#3D2B1F]/50">
                    {format(day, 'EEE', { locale: nl })}
                  </div>
                  <div className={`text-2xl font-display font-bold mt-0.5 ${today_ ? 'text-[#C49A6C]' : 'text-[#1A1410]'}`}>
                    {format(day, 'd')}
                  </div>
                </div>

                <div className="space-y-2">
                  {KAPPERS.map(k => {
                    const cnt = getAppts(ds, k.id).length
                    return (
                      <div key={k.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: k.colorHex }} />
                        <div className="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                          {cnt > 0 && (
                            <div className="h-full rounded-full"
                              style={{ backgroundColor: k.colorHex, width: `${Math.min(cnt / 8 * 100, 100)}%` }} />
                          )}
                        </div>
                        <span className="text-[11px] font-label text-[#3D2B1F]/45 tabular-nums w-3 text-right">
                          {cnt > 0 ? cnt : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {total > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#C49A6C]/10 text-[10px] font-label uppercase tracking-wider text-[#3D2B1F]/35">
                    {total} afspraken
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Afspraakdetails */}
      {expandedAppt && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase tracking-wider text-[#3D2B1F]/50">Afspraakdetails</span>
            <button onClick={() => setExpandedId(null)}
              className="text-xs text-[#3D2B1F]/40 hover:text-[#3D2B1F] transition-colors font-label">
              Sluiten
            </button>
          </div>
          <AppointmentCard
            appointment={expandedAppt}
            showActions="edit-delete"
            defaultExpanded
            onEdit={a => { onEdit(a); setExpandedId(null) }}
            onDelete={id => { onDelete(id); setExpandedId(null) }}
          />
        </div>
      )}
    </div>
  )
}
