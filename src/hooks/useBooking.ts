import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Service, TimeSlot } from '../types/database'
import { format } from 'date-fns'

export type BookingStep = 1 | 2 | 3 | 4

export interface BookingState {
  step: BookingStep
  service: Service | null
  date: Date | null
  slot: TimeSlot | null
  fullName: string
  email: string
  phone: string
  notes: string
  submitting: boolean
  error: string | null
  appointmentId: string | null
}

export function useBooking() {
  const [state, setState] = useState<BookingState>({
    step: 1,
    service: null,
    date: null,
    slot: null,
    fullName: '',
    email: '',
    phone: '',
    notes: '',
    submitting: false,
    error: null,
    appointmentId: null,
  })

  function setService(service: Service) {
    setState(s => ({ ...s, service, step: 2, date: null, slot: null }))
  }

  function setDate(date: Date) {
    setState(s => ({ ...s, date, slot: null }))
  }

  function setSlot(slot: TimeSlot) {
    setState(s => ({ ...s, slot }))
  }

  function goToStep3() {
    if (state.slot) setState(s => ({ ...s, step: 3 }))
  }

  function updateField(field: 'fullName' | 'email' | 'phone' | 'notes', value: string) {
    setState(s => ({ ...s, [field]: value }))
  }

  function goBack() {
    setState(s => ({ ...s, step: Math.max(1, s.step - 1) as BookingStep, error: null }))
  }

  async function submit() {
    if (!state.service || !state.date || !state.slot || !state.fullName || !state.email || !state.phone) {
      setState(s => ({ ...s, error: 'Vul alle verplichte velden in.' }))
      return
    }

    setState(s => ({ ...s, submitting: true, error: null }))

    const appointmentDate = format(state.date, 'yyyy-MM-dd')
    const startTime = format(state.slot.start, 'HH:mm:ss')
    const endTime = format(state.slot.end, 'HH:mm:ss')

    const { data, error } = await supabase.from('appointments').insert([{
      full_name: state.fullName,
      email: state.email,
      phone: state.phone,
      service_id: state.service.id,
      appointment_date: appointmentDate,
      start_time: startTime,
      end_time: endTime,
      status: 'pending',
      notes: state.notes || null,
    }]).select().single()

    if (error) {
      setState(s => ({ ...s, submitting: false, error: 'Er ging iets mis. Probeer het opnieuw.' }))
      return
    }

    setState(s => ({ ...s, submitting: false, step: 4, appointmentId: data.id }))
  }

  function reset() {
    setState({
      step: 1, service: null, date: null, slot: null,
      fullName: '', email: '', phone: '', notes: '',
      submitting: false, error: null, appointmentId: null,
    })
  }

  return { state, setService, setDate, setSlot, goToStep3, updateField, goBack, submit, reset }
}
