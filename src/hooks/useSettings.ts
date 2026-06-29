import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { BarbershopSettings } from '../types/database'

const DEFAULTS: Partial<BarbershopSettings> = {
  barbershop_name: 'Kapper Joop',
  barbershop_email: 'info@kapperjoop.nl',
  barbershop_phone: '0548 - 000 000',
  barbershop_address: 'Rijssen',
  slot_interval_minutes: 15,
  booking_notice_hours: 2,
}

function isTestData(s: BarbershopSettings): boolean {
  return (
    s.barbershop_name?.includes('Luxe') ||
    s.barbershop_address?.includes('New York') ||
    s.barbershop_address?.includes('Brooklyn') ||
    false
  )
}

export function useSettings() {
  const [settings, setSettings] = useState<BarbershopSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('barbershop_settings').select('*').single().then(({ data }) => {
      if (data) {
        const resolved = isTestData(data as BarbershopSettings)
          ? { ...data, ...DEFAULTS } as BarbershopSettings
          : data as BarbershopSettings
        setSettings(resolved)
      }
      setLoading(false)
    })
  }, [])

  return { settings, loading }
}
