import { useState, useEffect } from 'react'
import type { BusinessHours } from '../types/database'
import { supabase } from '../lib/supabase'

const KAPPER_JOOP_HOURS: Omit<BusinessHours, 'id'>[] = [
  { weekday: 0, is_open: false, start_time: null, end_time: null },
  { weekday: 1, is_open: true, start_time: '16:30', end_time: '20:30' },
  { weekday: 2, is_open: true, start_time: '08:00', end_time: '17:30' },
  { weekday: 3, is_open: true, start_time: '08:00', end_time: '17:30' },
  { weekday: 4, is_open: true, start_time: '08:00', end_time: '20:00' },
  { weekday: 5, is_open: true, start_time: '08:00', end_time: '17:30' },
  { weekday: 6, is_open: false, start_time: null, end_time: null },
]

function isGenericHours(rows: BusinessHours[]): boolean {
  const monday = rows.find(r => r.weekday === 1)
  return !!(monday?.start_time?.startsWith('09:00') || monday?.start_time?.startsWith('09:00:00'))
}

export function useBusinessHours() {
  const [hours, setHours] = useState<BusinessHours[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('business_hours')
      .select('*')
      .order('weekday')
      .then(({ data }) => {
        const rows = (data as BusinessHours[]) || []
        if (rows.length > 0 && isGenericHours(rows)) {
          // Replace generic data with Kapper Joop hours, preserving row IDs
          const fixed = KAPPER_JOOP_HOURS.map((defaults, i) => ({
            id: rows[i]?.id ?? String(i),
            ...defaults,
          })) as BusinessHours[]
          setHours(fixed)
        } else {
          setHours(rows)
        }
        setLoading(false)
      })
  }, [])

  return { hours, loading }
}
