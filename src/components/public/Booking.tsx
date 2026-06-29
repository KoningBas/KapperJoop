import { useState, useEffect } from 'react'
import { format, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isToday, isBefore } from 'date-fns'
import { nl } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, CheckCircle } from 'lucide-react'
import { useServices } from '../../hooks/useServices'
import { useAvailability } from '../../hooks/useAvailability'
import { useSettings } from '../../hooks/useSettings'
import { useBooking } from '../../hooks/useBooking'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import type { Service } from '../../types/database'
import { KAPPERS } from '../../config/kappers'
import type { KapperId } from '../../config/kappers'

const STEP_LABELS = ['Dienst', 'Kapper', 'Datum & tijd', 'Gegevens', 'Bevestigd']

interface StepIndicatorProps {
  current: number
}

function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 flex items-center justify-center text-sm font-bold"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  background: done ? '#C49A6C' : active ? 'transparent' : 'transparent',
                  border: done ? '1px solid #C49A6C' : active ? '2px solid #C49A6C' : '1px solid rgba(196,154,108,0.3)',
                  color: done ? '#1A1410' : active ? '#C49A6C' : '#A07848',
                }}
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : step}
              </div>
              <span
                className="text-xs uppercase tracking-widest hidden sm:block"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  color: active ? '#C49A6C' : done ? '#A07848' : 'rgba(160,120,72,0.5)',
                }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="w-8 sm:w-16 h-px mx-2 sm:mx-3 mb-5"
                style={{ background: step < current ? '#C49A6C' : 'rgba(196,154,108,0.25)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface DatePickerProps {
  selected: Date | null
  onSelect: (d: Date) => void
}

function DatePicker({ selected, onSelect }: DatePickerProps) {
  const today = startOfToday()
  const [offset, setOffset] = useState(0)
  const currentMonth = addMonths(startOfMonth(today), offset)
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#3D2B1F] font-semibold text-sm uppercase tracking-widest"
          style={{ fontFamily: "'Oswald', sans-serif" }}>
          {format(currentMonth, 'MMMM yyyy', { locale: nl })}
        </span>
        <div className="flex gap-2">
          <button
            className="p-1.5 text-[#C49A6C] disabled:opacity-30 hover:bg-[rgba(196,154,108,0.1)] transition-colors"
            onClick={() => setOffset(o => o - 1)}
            disabled={offset <= 0}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="p-1.5 text-[#C49A6C] hover:bg-[rgba(196,154,108,0.1)] transition-colors"
            onClick={() => setOffset(o => o + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map(d => (
          <div key={d} className="text-center text-xs font-semibold uppercase tracking-widest text-[#A07848]/60 pb-2"
            style={{ fontFamily: "'Oswald', sans-serif" }}>
            {d}
          </div>
        ))}
        {/* Fill empty slots before first day of month */}
        {Array.from({ length: (startOfMonth(currentMonth).getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => {
          const isSelected = selected && format(day, 'yyyy-MM-dd') === format(selected, 'yyyy-MM-dd')
          const past = isBefore(day, today) && !isToday(day)
          return (
            <button
              key={day.toISOString()}
              disabled={past}
              onClick={() => onSelect(day)}
              className="aspect-square flex items-center justify-center text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              style={{
                fontFamily: "'Lora', serif",
                background: isSelected ? '#C49A6C' : 'transparent',
                color: isSelected ? '#1A1410' : '#3D2B1F',
                border: isSelected ? 'none' : 'transparent 1px solid',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (!isSelected && !past) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(196,154,108,0.15)' }}
              onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface BookingProps {
  preselectServiceId?: string | null
}

export function Booking({ preselectServiceId }: BookingProps) {
  const { services } = useServices(true)
  const { settings } = useSettings()
  const { state, setService, selectKapper, setDate, setSlot, goToStep4, updateField, goBack, submit, reset } = useBooking()

  const slotInterval = settings?.slot_interval_minutes ?? 15
  const noticeHours = settings?.booking_notice_hours ?? 2

  const { slots, loading: slotsLoading, isBlocked, isClosed } = useAvailability(
    state.date,
    state.service?.duration_minutes ?? 0,
    slotInterval,
    noticeHours,
    state.kapper
  )

  // Preselect service from CTA
  useEffect(() => {
    if (preselectServiceId && services.length > 0 && !state.service) {
      const svc = services.find(s => s.id === preselectServiceId)
      if (svc) setService(svc)
    }
  }, [preselectServiceId, services])

  return (
    <section id="reserveren" className="py-24 bg-[#FDFAF5]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className="text-5xl md:text-6xl font-bold text-[#3D2B1F] tracking-[-0.02em]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Reserveer je stoel
          </h2>
        </div>

        {/* Step indicator */}
        <StepIndicator current={state.step} />

        {/* Step content */}
        <div className="bg-white p-8 md:p-12"
          style={{ border: '1px solid rgba(196,154,108,0.2)', boxShadow: '0 2px 8px rgba(196,154,108,0.08), 0 8px 32px rgba(26,20,16,0.06)' }}>

          {/* Step 1 — Service */}
          {state.step === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-[#3D2B1F] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>Kies een dienst</h3>
              <p className="text-[#3D2B1F]/60 mb-8 text-sm" style={{ fontFamily: "'Lora', serif" }}>
                Selecteer de behandeling die je wil boeken.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(svc => (
                  <ServiceCard
                    key={svc.id}
                    service={svc}
                    selected={state.service?.id === svc.id}
                    onSelect={setService}
                  />
                ))}
              </div>
              {state.service && (
                <div className="mt-8 flex justify-end">
                  <Button variant="copper" size="md" onClick={() => setDate(state.date || new Date())}>
                    Verder
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Kapper selection */}
          {state.step === 2 && (
            <div className="space-y-6">
              <h3 className="font-display text-2xl text-[#3D2B1F]">Kies je kapper</h3>
              <div className="grid grid-cols-3 gap-4">
                {KAPPERS.map(kapper => (
                  <button
                    key={kapper.id}
                    onClick={() => selectKapper(kapper.id)}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-[#C49A6C]/20 hover:border-[#C49A6C] hover:bg-[#C49A6C]/5 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C49A6C]"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-label font-semibold"
                      style={{ backgroundColor: kapper.colorHex }}
                    >
                      {kapper.name[0]}
                    </div>
                    <span className="font-label text-sm uppercase tracking-wider text-[#3D2B1F]">
                      {kapper.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-start">
                <Button variant="ghost" size="md" onClick={goBack}>
                  <ChevronLeft size={16} className="mr-2" />
                  Terug
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Date & Time */}
          {state.step === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-[#3D2B1F] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>Kies datum &amp; tijd</h3>
              <p className="text-[#3D2B1F]/60 mb-8 text-sm" style={{ fontFamily: "'Lora', serif" }}>
                Wanneer komt het jou uit?
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="p-5 border border-[rgba(196,154,108,0.2)] bg-[#FDFAF5]">
                  <div className="flex items-center gap-2 mb-4 text-[#C49A6C]">
                    <Calendar size={14} />
                    <span className="text-xs font-semibold uppercase tracking-widest"
                      style={{ fontFamily: "'Oswald', sans-serif" }}>Datum</span>
                  </div>
                  <DatePicker selected={state.date} onSelect={setDate} />
                </div>

                {/* Time slots */}
                <div className="p-5 border border-[rgba(196,154,108,0.2)] bg-[#FDFAF5]">
                  <div className="flex items-center gap-2 mb-4 text-[#C49A6C]">
                    <Clock size={14} />
                    <span className="text-xs font-semibold uppercase tracking-widest"
                      style={{ fontFamily: "'Oswald', sans-serif" }}>Tijdslot</span>
                  </div>

                  {!state.date ? (
                    <p className="text-[#3D2B1F]/40 text-sm italic" style={{ fontFamily: "'Lora', serif" }}>
                      Kies eerst een datum
                    </p>
                  ) : slotsLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-[rgba(196,154,108,0.08)] animate-pulse" />
                      ))}
                    </div>
                  ) : isBlocked ? (
                    <p className="text-[#8B2020] text-sm" style={{ fontFamily: "'Lora', serif" }}>
                      Deze dag is geblokkeerd.
                    </p>
                  ) : isClosed ? (
                    <p className="text-[#3D2B1F]/60 text-sm italic" style={{ fontFamily: "'Lora', serif" }}>
                      Gesloten op deze dag.
                    </p>
                  ) : slots.length === 0 ? (
                    <p className="text-[#3D2B1F]/60 text-sm italic" style={{ fontFamily: "'Lora', serif" }}>
                      Geen beschikbare tijdslots.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                      {slots.map((slot, i) => {
                        const selected = state.slot?.label === slot.label
                        return (
                          <button
                            key={i}
                            onClick={() => setSlot(slot)}
                            className="py-2.5 text-sm font-semibold uppercase tracking-wider animate-slot"
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                              animationDelay: `${i * 30}ms`,
                              background: selected ? '#C49A6C' : 'transparent',
                              color: selected ? '#1A1410' : '#3D2B1F',
                              border: selected ? '1px solid #C49A6C' : '1px solid rgba(196,154,108,0.3)',
                              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(196,154,108,0.12)' }}
                            onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                          >
                            {slot.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" size="md" onClick={goBack}>
                  <ChevronLeft size={16} className="mr-2" />
                  Terug
                </Button>
                <Button variant="copper" size="md" onClick={goToStep4} disabled={!state.slot}>
                  Verder
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 — Contact info */}
          {state.step === 4 && (
            <div>
              <h3 className="text-2xl font-bold text-[#3D2B1F] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>Jouw gegevens</h3>
              <p className="text-[#3D2B1F]/60 mb-8 text-sm" style={{ fontFamily: "'Lora', serif" }}>
                Bijna klaar. Vul je gegevens in.
              </p>

              {/* Summary */}
              <div className="bg-[#F5F0E8] p-4 mb-8 flex flex-wrap gap-6 text-sm border border-[rgba(196,154,108,0.2)]">
                <div>
                  <span className="text-[#A07848] uppercase tracking-widest text-xs font-semibold block mb-0.5"
                    style={{ fontFamily: "'Oswald', sans-serif" }}>Dienst</span>
                  <span style={{ fontFamily: "'Lora', serif" }}>{state.service?.name}</span>
                </div>
                {state.date && (
                  <div>
                    <span className="text-[#A07848] uppercase tracking-widest text-xs font-semibold block mb-0.5"
                      style={{ fontFamily: "'Oswald', sans-serif" }}>Datum</span>
                    <span style={{ fontFamily: "'Lora', serif" }}>
                      {format(state.date, 'EEEE d MMMM', { locale: nl })}
                    </span>
                  </div>
                )}
                {state.slot && (
                  <div>
                    <span className="text-[#A07848] uppercase tracking-widest text-xs font-semibold block mb-0.5"
                      style={{ fontFamily: "'Oswald', sans-serif" }}>Tijd</span>
                    <span style={{ fontFamily: "'Lora', serif" }}>{state.slot.label}</span>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Volledige naam"
                  placeholder="Jan de Vries"
                  required
                  value={state.fullName}
                  onChange={e => updateField('fullName', e.target.value)}
                />
                <Input
                  label="E-mailadres"
                  type="email"
                  placeholder="jan@voorbeeld.nl"
                  required
                  value={state.email}
                  onChange={e => updateField('email', e.target.value)}
                />
                <Input
                  label="Telefoonnummer"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  required
                  value={state.phone}
                  onChange={e => updateField('phone', e.target.value)}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Opmerking (optioneel)"
                    placeholder="Bijzondere wensen? Laat het weten."
                    value={state.notes}
                    onChange={e => updateField('notes', e.target.value)}
                  />
                </div>
              </div>

              {state.error && (
                <p className="mt-4 text-sm text-[#8B2020]" style={{ fontFamily: "'Lora', serif" }}>
                  {state.error}
                </p>
              )}

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" size="md" onClick={goBack}>
                  <ChevronLeft size={16} className="mr-2" />
                  Terug
                </Button>
                <Button
                  variant="copper"
                  size="md"
                  onClick={submit}
                  disabled={state.submitting || !state.fullName || !state.email || !state.phone}
                >
                  {state.submitting ? 'Bezig...' : 'Bevestig afspraak'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 5 — Confirmation */}
          {state.step === 5 && (
            <div className="text-center py-6">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle size={56} className="text-[#C49A6C]" strokeWidth={1.5} />
              </div>
              <h3
                className="text-4xl font-bold text-[#3D2B1F] mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Geregeld!
              </h3>
              <p className="text-[#3D2B1F]/70 text-lg mb-2 leading-relaxed"
                style={{ fontFamily: "'Lora', serif" }}>
                Joop verwacht je op{' '}
                <strong>{state.date ? format(state.date, 'EEEE d MMMM', { locale: nl }) : ''}</strong>
                {' '}om <strong>{state.slot?.label}</strong>.
              </p>
              <p className="text-[#3D2B1F]/60 text-base mb-10"
                style={{ fontFamily: "'Lora', serif" }}>
                Een bevestiging is onderweg naar {state.email}.<br />
                Kom op tijd. Hij ook.
              </p>

              {/* Summary */}
              <div className="bg-[#F5F0E8] p-6 mb-8 text-left border border-[rgba(196,154,108,0.2)] max-w-sm mx-auto">
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Dienst', value: state.service?.name },
                    { label: 'Datum', value: state.date ? format(state.date, 'EEEE d MMMM yyyy', { locale: nl }) : '' },
                    { label: 'Tijd', value: state.slot?.label },
                    { label: 'Naam', value: state.fullName },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between gap-4">
                      <span className="text-[#A07848] uppercase tracking-widest text-xs font-semibold"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>{row.label}</span>
                      <span className="text-[#3D2B1F]" style={{ fontFamily: "'Lora', serif" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="md" onClick={reset}>
                Nog een afspraak maken
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, selected, onSelect }: { service: Service; selected: boolean; onSelect: (s: Service) => void }) {
  return (
    <button
      onClick={() => onSelect(service)}
      className="text-left p-5 flex flex-col gap-3 transition-all duration-200 cursor-pointer"
      style={{
        background: selected ? 'rgba(196,154,108,0.08)' : 'white',
        border: selected ? '2px solid #C49A6C' : '1px solid rgba(196,154,108,0.25)',
        boxShadow: selected ? '0 2px 12px rgba(196,154,108,0.2)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-lg font-bold text-[#3D2B1F]"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {service.name}
        </span>
        {selected && (
          <div className="w-5 h-5 flex items-center justify-center bg-[#C49A6C] flex-shrink-0 mt-0.5">
            <Check size={12} strokeWidth={2.5} className="text-[#1A1410]" />
          </div>
        )}
      </div>
      <p className="text-[#3D2B1F]/60 text-sm" style={{ fontFamily: "'Lora', serif" }}>
        {service.description}
      </p>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-[#C49A6C]"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          €{Number(service.price).toFixed(0)}
        </span>
        <span className="text-xs font-semibold text-[#A07848] uppercase tracking-widest border border-[rgba(196,154,108,0.3)] px-2 py-0.5"
          style={{ fontFamily: "'Oswald', sans-serif" }}>
          {service.duration_minutes} min
        </span>
      </div>
    </button>
  )
}
