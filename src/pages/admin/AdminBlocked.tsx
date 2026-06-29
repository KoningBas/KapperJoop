import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import type { BlockedDate } from '../../types/database'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { Plus, Trash2, CalendarOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export function AdminBlocked() {
  const [blocked, setBlocked] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true })
    setBlocked((data as BlockedDate[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!newDate) return
    setAdding(true)
    await supabase.from('blocked_dates').insert([{ blocked_date: newDate, reason: newReason || null }])
    setNewDate('')
    setNewReason('')
    await load()
    setAdding(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await supabase.from('blocked_dates').delete().eq('id', id)
    setBlocked(prev => prev.filter(b => b.id !== id))
    setDeleting(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Geblokkeerde data</h1>
        <p className="text-gray-500 text-sm mt-1">Klanten kunnen op deze data niet reserveren</p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Datum blokkeren</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Datum *</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C]"
            />
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Reden (optioneel)</label>
            <input
              type="text"
              placeholder="bijv. Vakantie"
              value={newReason}
              onChange={e => setNewReason(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C49A6C] focus:border-[#C49A6C]"
            />
          </div>
          <Button type="submit" variant="copper" size="sm" disabled={adding}>
            <Plus size={14} className="mr-1.5" />
            {adding ? 'Toevoegen...' : 'Blokkeren'}
          </Button>
        </form>
      </div>

      {/* Blocked dates list */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-50 animate-pulse rounded" />)}
          </div>
        ) : blocked.length === 0 ? (
          <div className="py-14 text-center">
            <CalendarOff size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">Geen geblokkeerde data</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reden</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blocked.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {format(parseISO(b.blocked_date), 'EEEE d MMMM yyyy', { locale: nl })}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{b.reason || '—'}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting === b.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
