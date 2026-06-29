import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import type { BarbershopSettings } from '../../types/database'
import { Button } from '../../components/ui/Button'
import { Save } from 'lucide-react'

export function AdminSettings() {
  const [settings, setSettings] = useState<BarbershopSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('barbershop_settings').select('*').single().then(({ data }) => {
      setSettings(data as BarbershopSettings)
      setLoading(false)
    })
  }, [])

  function update(field: keyof BarbershopSettings, value: string | number) {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    await supabase.from('barbershop_settings').update({
      barbershop_name: settings.barbershop_name,
      barbershop_email: settings.barbershop_email,
      barbershop_phone: settings.barbershop_phone,
      barbershop_address: settings.barbershop_address,
      slot_interval_minutes: settings.slot_interval_minutes,
      booking_notice_hours: settings.booking_notice_hours,
    }).eq('id', settings.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const FIELDS: Array<{
    key: keyof BarbershopSettings
    label: string
    type?: string
    min?: number
    step?: number
    placeholder?: string
  }> = [
    { key: 'barbershop_name', label: 'Naam', placeholder: 'Kapper Joop' },
    { key: 'barbershop_email', label: 'E-mailadres', type: 'email', placeholder: 'info@kapperjoop.nl' },
    { key: 'barbershop_phone', label: 'Telefoonnummer', placeholder: '0548 - 000 000' },
    { key: 'barbershop_address', label: 'Adres', placeholder: 'Rijssen' },
    { key: 'slot_interval_minutes', label: 'Slot interval (minuten)', type: 'number', min: 5, step: 5 },
    { key: 'booking_notice_hours', label: 'Min. boektijd vooruit (uren)', type: 'number', min: 0, step: 1 },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-500 text-sm mt-1">Bedrijfsgegevens en boekingsinstellingen</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded" />)}
        </div>
      ) : settings ? (
        <form onSubmit={handleSave} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {FIELDS.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type || 'text'}
                  value={String(settings[field.key] ?? '')}
                  onChange={e => update(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                  min={field.min}
                  step={field.step}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C]"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4 pt-4 border-t border-gray-100">
            <Button type="submit" variant="copper" size="md" disabled={saving}>
              <Save size={14} className="mr-2" />
              {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
            </Button>
            {saved && <p className="text-sm text-emerald-600 font-medium">✓ Opgeslagen</p>}
          </div>
        </form>
      ) : (
        <p className="text-gray-400 text-sm">Instellingen niet beschikbaar.</p>
      )}
    </div>
  )
}
