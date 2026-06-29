import { supabase } from './supabase'

const DUTCH_SERVICES = [
  { name: 'Knippen', description: 'Een strakke knipbeurt zoals het hoort. Stijlvol afgewerkt.', duration_minutes: 30, price: 15.00, is_active: true },
  { name: 'Baard trimmen', description: 'Jouw baard in model — kort of lang, altijd strak.', duration_minutes: 20, price: 10.00, is_active: true },
  { name: 'Knippen + Baard', description: 'Compleet verzorgd van boven tot onder. Het totaalpakket.', duration_minutes: 45, price: 22.00, is_active: true },
  { name: 'Scheren met warm doek', description: 'Het klassieke scheermes-ritueel met warm doek. Pure verwennerij.', duration_minutes: 30, price: 18.00, is_active: true },
  { name: 'Kinderknipbeurt', description: 'Voor de kleintjes. Joop is geduldig. Meestal.', duration_minutes: 25, price: 12.00, is_active: true },
]

const DEFAULT_HOURS = [
  { weekday: 0, is_open: false, start_time: null, end_time: null },
  { weekday: 1, is_open: true, start_time: '16:30', end_time: '20:30' },
  { weekday: 2, is_open: true, start_time: '08:00', end_time: '17:30' },
  { weekday: 3, is_open: true, start_time: '08:00', end_time: '17:30' },
  { weekday: 4, is_open: true, start_time: '08:00', end_time: '20:00' },
  { weekday: 5, is_open: true, start_time: '08:00', end_time: '17:30' },
  { weekday: 6, is_open: false, start_time: null, end_time: null },
]

export async function seedIfEmpty() {
  try {
    const { data: services } = await supabase.from('services').select('id').limit(1)
    if (!services || services.length === 0) {
      await supabase.from('services').insert(DUTCH_SERVICES)
    }

    const { data: hours } = await supabase.from('business_hours').select('id').limit(1)
    if (!hours || hours.length === 0) {
      await supabase.from('business_hours').insert(DEFAULT_HOURS)
    }

    const { data: settings } = await supabase.from('barbershop_settings').select('id').limit(1)
    if (!settings || settings.length === 0) {
      await supabase.from('barbershop_settings').insert([{
        barbershop_name: 'Kapper Joop',
        barbershop_email: 'info@kapperjoop.nl',
        barbershop_phone: '0548 - 000 000',
        barbershop_address: 'Rijssen',
        slot_interval_minutes: 15,
        booking_notice_hours: 2,
      }])
    }
  } catch (err) {
    console.warn('Seed error (tables may not exist yet):', err)
  }
}

export async function fixDataIfNeeded() {
  try {
    // Fix services if they have non-Dutch names (runs with admin auth)
    const { data: services } = await supabase.from('services').select('id, name').order('created_at')
    if (services && services.length > 0) {
      const isEnglish = services.some(s =>
        ['Classic Haircut', 'Skin Fade', 'Beard Trim', 'Haircut & Beard', 'Hot Towel Shave', 'Kids Haircut'].includes(s.name)
      )
      if (isEnglish) {
        // Replace all services with Dutch ones
        for (const svc of services) {
          await supabase.from('services').delete().eq('id', svc.id)
        }
        await supabase.from('services').insert(DUTCH_SERVICES)
      }
    }

    // Fix settings if they have wrong barbershop name
    const { data: settingsRows } = await supabase.from('barbershop_settings').select('id, barbershop_name')
    if (settingsRows && settingsRows.length > 0) {
      const s = settingsRows[0]
      if (s.barbershop_name !== 'Kapper Joop') {
        await supabase.from('barbershop_settings').update({
          barbershop_name: 'Kapper Joop',
          barbershop_email: 'info@kapperjoop.nl',
          barbershop_phone: '0548 - 000 000',
          barbershop_address: 'Rijssen',
          slot_interval_minutes: 15,
          booking_notice_hours: 2,
        }).eq('id', s.id)
      }
    }

    // Fix business hours if they're generic (09:00-18:00)
    const { data: hoursRows } = await supabase.from('business_hours').select('id, weekday, start_time')
    if (hoursRows && hoursRows.length > 0) {
      const mondayRow = hoursRows.find(h => h.weekday === 1)
      if (mondayRow && mondayRow.start_time?.startsWith('09:00')) {
        for (const h of DEFAULT_HOURS) {
          const row = hoursRows.find(r => r.weekday === h.weekday)
          if (row) {
            await supabase.from('business_hours').update({
              is_open: h.is_open,
              start_time: h.start_time,
              end_time: h.end_time,
            }).eq('id', row.id)
          }
        }
      }
    }
  } catch (err) {
    console.warn('fixDataIfNeeded error:', err)
  }
}
