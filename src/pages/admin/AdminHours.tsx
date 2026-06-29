import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { BusinessHours } from '../../types/database'
import { Button } from '../../components/ui/Button'
import { Save } from 'lucide-react'

const DAY_NAMES = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']

export function AdminHours() {
  const [hours, setHours] = useState<BusinessHours[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('business_hours').select('*').order('weekday').then(({ data }) => {
      setHours((data as BusinessHours[]) || [])
      setLoading(false)
    })
  }, [])

  function update(id: string, field: keyof BusinessHours, value: unknown) {
    setHours(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h))
  }

  async function handleSave() {
    setSaving(true)
    await Promise.all(
      hours.map(h =>
        supabase.from('business_hours').update({
          is_open: h.is_open,
          start_time: h.is_open ? h.start_time : null,
          end_time: h.is_open ? h.end_time : null,
        }).eq('id', h.id)
      )
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Openingstijden</h1>
        <p className="text-gray-500 text-sm mt-1">Wijzigingen zijn direct van invloed op de boekflow</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(7)].map((_, i) => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
              <div className="col-span-3">Dag</div>
              <div className="col-span-2">Open</div>
              <div className="col-span-3">Openingstijd</div>
              <div className="col-span-3">Sluitingstijd</div>
            </div>
            {hours.map(h => (
              <div key={h.id} className={`grid grid-cols-12 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors ${!h.is_open ? 'opacity-60' : ''}`}>
                <div className="col-span-3 font-medium text-gray-900">{DAY_NAMES[h.weekday]}</div>
                <div className="col-span-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h.is_open}
                      onChange={e => update(h.id, 'is_open', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#C49A6C] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform" />
                  </label>
                </div>
                <div className="col-span-3">
                  <input
                    type="time"
                    value={h.start_time || ''}
                    disabled={!h.is_open}
                    onChange={e => update(h.id, 'start_time', e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C] disabled:bg-gray-50 disabled:text-gray-300 w-28"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="time"
                    value={h.end_time || ''}
                    disabled={!h.is_open}
                    onChange={e => update(h.id, 'end_time', e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C] disabled:bg-gray-50 disabled:text-gray-300 w-28"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Button variant="copper" size="md" onClick={handleSave} disabled={saving}>
          <Save size={14} className="mr-2" />
          {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </Button>
        {saved && <p className="text-sm text-emerald-600 font-medium">✓ Opgeslagen</p>}
      </div>
    </div>
  )
}
