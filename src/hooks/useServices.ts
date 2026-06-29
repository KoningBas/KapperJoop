import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Service } from '../types/database'

export function useServices(activeOnly = true) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase.from('services').select('*').order('created_at')
      if (activeOnly) query = query.eq('is_active', true)
      const { data, error } = await query
      if (error) setError(error.message)
      else setServices(data || [])
      setLoading(false)
    }
    load()
  }, [activeOnly])

  return { services, loading, error, refetch: () => setLoading(prev => { void prev; return true }) }
}
