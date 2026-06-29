import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { TimeSlot } from '../types/database'
import { format, addMinutes } from 'date-fns'

function parseTime(timeStr: string, date: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const result = new Date(date)
  result.setHours(hours, minutes, 0, 0)
  return result
}

export function useAvailability(date: Date | null, durationMinutes: number, slotInterval: number, bookingNoticeHours: number, kapperId: string | null) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    if (!date || durationMinutes <= 0 || !kapperId) {
      setSlots([])
      return
    }

    async function generate() {
      if (!date) return
      setLoading(true)
      setIsBlocked(false)
      setIsClosed(false)

      const dateStr = format(date, 'yyyy-MM-dd')
      const weekday = date.getDay()

      // Check blocked dates
      const { data: blocked } = await supabase
        .from('blocked_dates')
        .select('id')
        .eq('blocked_date', dateStr)
        .single()

      if (blocked) {
        setIsBlocked(true)
        setSlots([])
        setLoading(false)
        return
      }

      // Get business hours
      const { data: hours } = await supabase
        .from('business_hours')
        .select('*')
        .eq('weekday', weekday)
        .single()

      if (!hours || !hours.is_open || !hours.start_time || !hours.end_time) {
        setIsClosed(true)
        setSlots([])
        setLoading(false)
        return
      }

      // Get existing appointments
      const { data: existing } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('appointment_date', dateStr)
        .eq('kapper_id', kapperId)
        .neq('status', 'cancelled')

      const dayStart = parseTime(hours.start_time, date)
      const dayEnd = parseTime(hours.end_time, date)
      const now = new Date()
      const noticeBuffer = addMinutes(now, bookingNoticeHours * 60)

      const generated: TimeSlot[] = []
      let cursor = new Date(dayStart)

      while (true) {
        const slotEnd = addMinutes(cursor, durationMinutes)
        if (slotEnd > dayEnd) break

        // Skip if within booking notice window
        if (cursor <= noticeBuffer) {
          cursor = addMinutes(cursor, slotInterval)
          continue
        }

        // Check overlap with existing
        const overlaps = (existing || []).some(appt => {
          if (!appt.start_time || !appt.end_time) return false
          const existStart = parseTime(appt.start_time, date)
          const existEnd = parseTime(appt.end_time, date)
          return cursor < existEnd && slotEnd > existStart
        })

        if (!overlaps) {
          generated.push({
            start: new Date(cursor),
            end: new Date(slotEnd),
            label: format(cursor, 'HH:mm'),
          })
        }

        cursor = addMinutes(cursor, slotInterval)
      }

      setSlots(generated)
      setLoading(false)
    }

    generate()
  }, [date ? format(date, 'yyyy-MM-dd') : null, durationMinutes, slotInterval, bookingNoticeHours, kapperId])

  return { slots, loading, isBlocked, isClosed }
}
