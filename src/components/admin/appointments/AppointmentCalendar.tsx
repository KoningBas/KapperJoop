import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfWeek, isToday, addWeeks, subWeeks } from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Appointment } from '../../../types/database'
import { KAPPERS } from '../../../config/kappers'
import AppointmentCard from './AppointmentCard'

type ViewMode = 'dag' | 'week'

const HOUR_START = 8
const HOUR_END = 19
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => i + HOUR_START)
const HOUR_HEIGHT = 72

function timeToMinutes(t: string) {
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
  const [filterKapper, setFilterKapper] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)) // Mon–Sat

  function navigate(dir: 1 | -1) {
    if (view === 'week') setSelectedDate(d => dir === 1 ? addWeeks(d, 1) : subWeeks(d, 1))
    else setSelectedDate(d => addDays(d, dir))
  }

  function getAppts(dateStr: string, kapperId?: string) {
    return appointments.filter(a =>
      a.appointment_date === dateStr && (!kapperId || a.kapper_id === kapperId)
    )
  }

  function apptStyle(a: Appointment) {
    const startMin = timeToMinutes(a.start_time) - HOUR_START * 60
    const dur = timeToMinutes(a.end_time) - timeToMinutes(a.start_time)
    const heightPx = Math.max((dur / 60) * HOUR_HEIGHT - 3, 22)
    return {
      top: `${(startMin / 60) * HOUR_HEIGHT}px`,
      height: `${heightPx}px`,
      _heightPx: heightPx,
    }
  }

  const expandedAppt = expandedId ? appointments.find(a => a.id === expandedId) : null
  const activeKappers = filterKapper ? KAPPERS.filter(k => k.id === filterKapper) : KAPPERS
  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  const hourLabels = (
    <div className="border-r border-[#C49A6C]/10">
      {HOURS.map(h => (
        <div key={h} style={{ height: HOUR_HEIGHT }}
          className="border-b border-[#C49A6C]/5 last:border-b-0 flex items-start pt-1 px-2">
          <span className="text-[11px] text-[#3D2B1F]/35 font-label tabular-nums">{h}:00</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
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
          <span className="text-sm font-label text-[#3D2B1F] min-w-[200px] text-center capitalize">
            {view === 'week'
              ? `${format(weekStart, 'd MMM', { locale: nl })} – ${format(weekDays[5], 'd MMM yyyy', { locale: nl })}`
              : format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
          </span>
          <button onClick={() => navigate(1)}
            className="p-1.5 rounded-lg hover:bg-[#C49A6C]/10 text-[#3D2B1F]/60 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Kapper filter — alleen in weekview */}
        {view === 'week' && (
          <div className="flex gap-1.5 ml-auto flex-wrap">
            <button onClick={() => setFilterKapper(null)}
              className={`px-3 py-1 rounded-full text-xs font-label uppercase tracking-wider transition-colors ${
                !filterKapper ? 'bg-[#1A1410] text-[#C49A6C]' : 'border border-[#C49A6C]/20 text-[#3D2B1F]/50 hover:border-[#C49A6C]/50'
              }`}>Allen</button>
            {KAPPERS.map(k => (
              <button key={k.id} onClick={() => setFilterKapper(k.id === filterKapper ? null : k.id)}
                className={`px-3 py-1 rounded-full text-xs font-label uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  filterKapper === k.id ? 'text-white' : 'border border-[#C49A6C]/20 text-[#3D2B1F]/50 hover:border-[#C49A6C]/50'
                }`}
                style={filterKapper === k.id ? { backgroundColor: k.colorHex } : {}}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: k.colorHex }} />
                {k.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Calendar grid */}
      <div className="border border-[#C49A6C]/15 rounded-xl overflow-auto bg-white shadow-sm">

        {view === 'dag' ? (
          <>
            {/* Kapper-kolom headers */}
            <div className="grid sticky top-0 z-10 bg-white border-b border-[#C49A6C]/10"
              style={{ gridTemplateColumns: `56px repeat(3, 1fr)` }}>
              <div className="border-r border-[#C49A6C]/10 p-2 flex items-end pb-2">
                <span className="text-[10px] text-[#3D2B1F]/25 font-label uppercase tracking-wider">Tijd</span>
              </div>
              {KAPPERS.map(k => {
                const count = getAppts(dateStr, k.id).length
                return (
                  <div key={k.id}
                    className="border-r border-[#C49A6C]/10 last:border-r-0 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: k.colorHex }} />
                      <span className="font-label text-sm font-semibold text-[#1A1410]">{k.name}</span>
                      <span className="ml-auto text-xs font-label text-[#3D2B1F]/35 tabular-nums">
                        {count} {count === 1 ? 'afspraak' : 'afspraken'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tijdgrid */}
            <div className="grid" style={{ gridTemplateColumns: `56px repeat(3, 1fr)` }}>
              {hourLabels}
              {KAPPERS.map(k => {
                const appts = getAppts(dateStr, k.id)
                return (
                  <div key={k.id} className="relative border-r border-[#C49A6C]/10 last:border-r-0">
                    {HOURS.map(h => (
                      <div key={h} style={{ height: HOUR_HEIGHT }}
                        className="border-b border-[#C49A6C]/5 last:border-b-0" />
                    ))}
                    {appts.map(a => {
                      const { _heightPx, ...posStyle } = apptStyle(a)
                      const svcName = (a.services as { name?: string })?.name ?? ''
                      return (
                        <button key={a.id}
                          onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          className="absolute inset-x-1.5 rounded-lg text-left overflow-hidden transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shadow-sm"
                          style={{ ...posStyle, backgroundColor: k.colorHex + 'E8' }}>
                          <div className="h-full px-2.5 py-2 flex flex-col gap-0.5">
                            <div className="text-[11px] font-label font-bold text-white/80 leading-none tabular-nums">
                              {a.start_time.slice(0, 5)}–{a.end_time.slice(0, 5)}
                            </div>
                            <div className="text-[13px] font-body font-semibold text-white leading-tight truncate">
                              {a.full_name}
                            </div>
                            {svcName && _heightPx > 52 && (
                              <div className="text-[11px] text-white/65 truncate leading-tight">{svcName}</div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <>
            {/* Week headers */}
            <div className="grid sticky top-0 z-10 bg-white border-b border-[#C49A6C]/10"
              style={{ gridTemplateColumns: `56px repeat(6, 1fr)` }}>
              <div className="border-r border-[#C49A6C]/10" />
              {weekDays.map(day => {
                const ds = format(day, 'yyyy-MM-dd')
                return (
                  <button key={day.toISOString()}
                    onClick={() => { setSelectedDate(day); setView('dag') }}
                    className={`p-2 text-center border-r border-[#C49A6C]/10 last:border-r-0 transition-colors hover:bg-[#F5F0E8]/60 ${
                      isToday(day) ? 'bg-[#C49A6C]/5' : ''
                    }`}>
                    <div className="text-[10px] font-label uppercase tracking-wider text-[#3D2B1F]/50">
                      {format(day, 'EEE', { locale: nl })}
                    </div>
                    <div className={`text-sm font-semibold mt-0.5 ${isToday(day) ? 'text-[#C49A6C]' : 'text-[#3D2B1F]'}`}>
                      {format(day, 'd')}
                    </div>
                    {/* Gekleurde stippen per kapper */}
                    <div className="flex justify-center gap-0.5 mt-1.5">
                      {KAPPERS.map(k => {
                        if (filterKapper && filterKapper !== k.id) return null
                        const cnt = getAppts(ds, k.id).length
                        return cnt > 0
                          ? <div key={k.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: k.colorHex }} />
                          : null
                      })}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Week tijdgrid */}
            <div className="grid" style={{ gridTemplateColumns: `56px repeat(6, 1fr)` }}>
              {hourLabels}
              {weekDays.map(day => {
                const ds = format(day, 'yyyy-MM-dd')
                const n = activeKappers.length
                return (
                  <div key={day.toISOString()} className="relative border-r border-[#C49A6C]/10 last:border-r-0">
                    {HOURS.map(h => (
                      <div key={h} style={{ height: HOUR_HEIGHT }}
                        className={`border-b border-[#C49A6C]/5 last:border-b-0 ${isToday(day) ? 'bg-[#C49A6C]/[0.02]' : ''}`} />
                    ))}
                    {activeKappers.map((k, ki) => {
                      const laneW = 100 / n
                      return getAppts(ds, k.id).map(a => {
                        const { _heightPx, ...posStyle } = apptStyle(a)
                        return (
                          <button key={a.id}
                            onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                            className="absolute rounded text-white text-left overflow-hidden transition-[filter] hover:brightness-110 focus-visible:outline-none"
                            style={{
                              ...posStyle,
                              left: `${ki * laneW + 0.5}%`,
                              right: `${(n - ki - 1) * laneW + 0.5}%`,
                              backgroundColor: k.colorHex + 'DD',
                            }}>
                            <div className="px-1 py-0.5">
                              <div className="text-[9px] font-label font-semibold truncate leading-tight">
                                {a.start_time.slice(0, 5)} {a.full_name.split(' ')[0]}
                              </div>
                            </div>
                          </button>
                        )
                      })
                    })}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

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
