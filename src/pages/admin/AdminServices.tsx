import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import type { Service } from '../../types/database'
import { Plus, Edit2, Power, X, Check } from 'lucide-react'
import { Button } from '../../components/ui/Button'

interface ServiceFormData {
  name: string
  description: string
  duration_minutes: number
  price: number
  is_active: boolean
}

const EMPTY_FORM: ServiceFormData = {
  name: '', description: '', duration_minutes: 30, price: 15, is_active: true
}

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceFormData>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const { data } = await supabase.from('services').select('*').order('created_at')
    setServices((data as Service[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(svc: Service) {
    setEditing(svc)
    setForm({ name: svc.name, description: svc.description, duration_minutes: svc.duration_minutes, price: Number(svc.price), is_active: svc.is_active })
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    if (editing) {
      await supabase.from('services').update(form).eq('id', editing.id)
    } else {
      await supabase.from('services').insert([form])
    }
    await load()
    setModalOpen(false)
    setSubmitting(false)
  }

  async function toggleActive(svc: Service) {
    await supabase.from('services').update({ is_active: !svc.is_active }).eq('id', svc.id)
    setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_active: !s.is_active } : s))
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diensten</h1>
          <p className="text-gray-500 text-sm mt-1">Beheer de beschikbare diensten</p>
        </div>
        <Button variant="copper" size="sm" onClick={openNew}>
          <Plus size={14} className="mr-2" />
          Nieuwe dienst
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">Geen diensten gevonden</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Naam', 'Beschrijving', 'Duur', 'Prijs', 'Status', 'Acties'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map(svc => (
                <tr key={svc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">{svc.name}</td>
                  <td className="px-5 py-4 text-gray-500 max-w-[200px] truncate">{svc.description}</td>
                  <td className="px-5 py-4 text-gray-600">{svc.duration_minutes} min</td>
                  <td className="px-5 py-4 font-medium text-gray-900">€{Number(svc.price).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${
                      svc.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {svc.is_active ? <Check size={10} /> : null}
                      {svc.is_active ? 'Actief' : 'Inactief'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="p-1.5 text-gray-400 hover:text-[#C49A6C] transition-colors rounded hover:bg-[rgba(196,154,108,0.08)]"
                        title="Bewerken"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => toggleActive(svc)}
                        className={`p-1.5 rounded transition-colors ${svc.is_active ? 'text-emerald-500 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'}`}
                        title={svc.is_active ? 'Deactiveren' : 'Activeren'}
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editing ? 'Dienst bewerken' : 'Nieuwe dienst'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Naam *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Beschrijving</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Duur (minuten) *</label>
                  <input
                    type="number" min={5} step={5} required
                    value={form.duration_minutes}
                    onChange={e => setForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Prijs (€) *</label>
                  <input
                    type="number" min={0} step={0.5} required
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="is_active" type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-[#C49A6C]"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Actief (zichtbaar op website)</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
                  Annuleren
                </button>
                <Button type="submit" variant="copper" size="sm" disabled={submitting}>
                  {submitting ? 'Opslaan...' : editing ? 'Wijzigingen opslaan' : 'Dienst aanmaken'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
