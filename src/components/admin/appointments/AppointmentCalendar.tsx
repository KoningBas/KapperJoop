import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format, addDays, startOfWeek, isSameDay,
  addWeeks, subWeeks
} from 'date-fns'
import { nl } from 'date-fns/locale'
import type { Appointment } from '../../../types/database'
import { getKapper, KAPPERS } from '../../../config/kappers'
import AppointmentCard from './AppointmentCard'

type ViewMode = 'dag' | 'week'

const HOUR_START = 8
const HOUR_END = 20
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => i + HOUR_START)
const HOUR_HEIGHT = 64 // px per hour

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
  const [view, setView] = useState<ViewMode>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterKapper, setFilterKapper] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const visibleDays = view === 'week' ? weekDays : [selectedDate]

  const filtered = useMemo(
    () => appointments.filter(a => !filterKapper || a.kapper_id === filterKapper),
    [appointments, filterKapper]
  )

  function navigate(dir: 1 | -1) {
    if (view === 'week') setSelectedDate(d => dir === 1 ? addWeeks(d, 1) : subWeeks(d, 1))
    else setSelectedDate(d => addDays(d, dir))
  }

  function getDayAppointments(day: Date) {
    const dayStr = format(day, 'yyyy-MM-dd')
    return filtered.filter(a => a.appointment_date === dayStr)
  }

  function getEventStyle(a: Appointment) {
    const startMin = timeToMinutes(a.start_time) - HOUR_START * 60
    const durationMin = timeToMinutes(a.end_time) - timeToMinutes(a.start_time)
    return {
      top: `${(startMin / 60) * HOUR_HEIGHT}px`,
      height: `${Math.max((durationMin / 60) * HOUR_HEIGHT - 2, 24)}px`,
    }
  }

  const expandedAppt = expandedId ? appointments.find(a => a.id === expandedId) : null

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dag / Week toggle */}
        <div className="flex rounded-lg border border-[#C49A6C]/20 overflow-hidden">
          {(['dag', 'week'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm font-label uppercase tracking-wider transition-colors ${
                view === v
                  ? 'bg-[#C49A6C] text-white'
                  : 'text-[#3D2B1F]/60 hover:bg-[#C49A6C]/10'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Navigatie */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-[#C49A6C]/10 text-[#3D2B1F]/60 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-label uppercase tracking-wider text-[#3D2B1F] min-w-[160px] text-center">
            {view === 'week'
              ? `${format(weekStart, 'd MMM', { locale: nl })} – ${format(weekDays[6], 'd MMM yyyy', { locale: nl })}`
              : format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
          </span>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded-lg hover:bg-[#C49A6C]/10 text-[#3D2B1F]/60 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Kapper filter */}
        <div className="flex gap-1.5 ml-auto flex-wrap">
          <button
            onClick={() => setFilterKapper(null)}
            className={`px-3 py-1 rounded-full text-xs font-label uppercase tracking-wider transition-colors ${
              !filterKapper
                ? 'bg-[#1A1410] text-[#C49A6C]'
                : 'border border-[#C49A6C]/20 text-[#3D2B1F]/50 hover:border-[#C49A6C]/50'
            }`}
          >
            Allen
          </button>
          {KAPPERS.map(k => (
            <button
              key={k.id}
              onClick={() => setFilterKapper(k.id === filterKapper ? null : k.id)}
              className={`px-3 py-1 rounded-full text-xs font-label uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                filterKapper === k.id
                  ? 'text-white'
                  : 'border border-[#C49A6C]/20 text-[#3D2B1F]/50 hover:border-[#C49A6C]/50'
              }`}
              style={filterKapper === k.id ? { backgroundColor: k.colorHex } : {}}
            >
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: k.colorHex }} />
              {k.name}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="border border-[#C49A6C]/15 rounded-xl overflow-auto bg-white">
        {/* Day headers */}
        <div
          className="grid sticky top-0 z-10 bg-white border-b border-[#C49A6C]/10"
          style={{ gridTemplateColumns: `56px repeat(${visibleDays.length}, 1fr)` }}
        >
          <div className="border-r border-[#C49A6C]/10" />
          {visibleDays.map(day => (
            <button
              key={day.toISOString()}
              onClick={() => { setSelectedDate(day); setView('dag') }}
              className={`p-2 text-center border-r border-[#C49A6C]/10 last:border-r-0 transition-colors hover:bg-[#F5F0E8]/50 ${
                isSameDay(day, new Date()) ? 'bg-[#C49A6C]/5' : ''
              }`}
            >
              <div className="text-[10px] font-label uppercase tracking-wider text-[#3D2B1F]/50">
                {format(day, 'EEE', { locale: nl })}
              </div>
              <div className={`text-sm font-semibold mt-0.5 ${
                isSameDay(day, new Date()) ? 'text-[#C49A6C]' : 'text-[#3D2B1F]'
              }`}>
                {format(day, 'd')}
              </div>
            </button>
          ))}
        </div>

        {/* Time grid */}
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `56px repeat(${visibleDays.length}, 1fr)`,
            minHeight: `${HOURS.length * HOUR_HEIGHT}px`,
          }}
        >
          {/* Hour labels */}
          <div className="border-r border-[#C49A6C]/10">
            {HOURS.map(h => (
              <div
                key={h}
                style={{ height: HOUR_HEIGHT }}
                className="border-b border-[#C49A6C]/5 last:border-b-0 flex items-start pt-1 px-1.5"
              >
                <span className="text-[10px] text-[#3D2B1F]/30 font-label">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {visibleDays.map(day => {
            const dayAppts = getDayAppointments(day)
            return (
              <div key={day.toISOString()} className="relative border-r border-[#C49A6C]/10 last:border-r-0">
                {HOURS.map(h => (
                  <div
                    key={h}
                    style={{ height: HOUR_HEIGHT }}
                    className={`border-b border-[#C49A6C]/5 last:border-b-0 ${
                      isSameDay(day, new Date()) ? 'bg-[#C49A6C]/[0.02]' : ''
                    }`}
                  />
                ))}

                {dayAppts.map(a => {
                  const kapper = getKapper(a.kapper_id)
                  const serviceName = (a.services as any)?.name ?? ''
                  const isExpanded = expandedId === a.id
                  return (
                    <button
                      key={a.id}
                      onClick={() => setExpandedId(isExpanded ? null : a.id)}
                      className="absolute left-0.5 right-0.5 rounded text-white text-left p-1 overflow-hidden transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      style={{ ...getEventStyle(a), backgroundColor: kapper.colorHex + 'DD' }}
                    >
                      <div className="text-[10px] font-label font-semibold truncate leading-tight">
                        {a.start_time.slice(0, 5)} {a.full_name}
                      </div>
                      {serviceName && (
                        <div className="text-[9px] opacity-75 truncate leading-tight">{serviceName}</div>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Expanded appointment details */}
      {expandedAppt && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-label uppercase tracking-wider text-[#3D2B1F]/50">
              Afspraakdetails
            </span>
            <button
              onClick={() => setExpandedId(null)}
              className="text-xs text-[#3D2B1F]/40 hover:text-[#3D2B1F] transition-colors font-label"
            >
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
