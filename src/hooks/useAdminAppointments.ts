import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Appointment } from '../types/database'

export function useAdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('appointments')
      .select('*, services(name, duration_minutes)')
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true })
    if (err) setError(err.message)
    else {
      setAppointments((data ?? []) as Appointment[])
      setError(null)
    }
    setLoading(false)
  }, [])

  const runAutoCleanup = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0]
    const nowTime = new Date().toTimeString().slice(0, 8)

    const { error: e1 } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('status', 'pending')
      .lt('appointment_date', today)
    if (e1) console.warn('Auto-cleanup (pending→cancelled):', e1.message)

    const { error: e2 } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('status', 'confirmed')
      .lt('appointment_date', today)
    if (e2) console.warn('Auto-cleanup (confirmed past→completed):', e2.message)

    const { error: e3 } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('status', 'confirmed')
      .eq('appointment_date', today)
      .lt('end_time', nowTime)
    if (e3) console.warn('Auto-cleanup (same-day past→completed):', e3.message)

    await refetch()
  }, [refetch])

  useEffect(() => { runAutoCleanup() }, [runAutoCleanup])

  const updateStatus = useCallback(async (
    id: string,
    status: Appointment['status']
  ) => {
    const { error: err } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
    if (!err) await refetch()
    return err
  }, [refetch])

  const updateAppointment = useCallback(async (
    id: string,
    patch: Partial<Pick<Appointment, 'appointment_date' | 'start_time' | 'end_time' | 'kapper_id' | 'notes'>>
  ) => {
    const { error: err } = await supabase
      .from('appointments')
      .update(patch)
      .eq('id', id)
    if (!err) await refetch()
    return err
  }, [refetch])

  const deleteAppointment = useCallback(async (id: string) => {
    const { error: err } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    if (!err) await refetch()
    return err
  }, [refetch])

  return {
    appointments,
    pending: appointments.filter(a => a.status === 'pending'),
    confirmed: appointments.filter(a => a.status === 'confirmed'),
    loading,
    error,
    refetch,
    updateStatus,
    updateAppointment,
    deleteAppointment,
  }
}
