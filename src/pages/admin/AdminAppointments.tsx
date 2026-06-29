import { useState } from 'react'
import { Calendar, Inbox, ClipboardList } from 'lucide-react'
import { useAdminAppointments } from '../../hooks/useAdminAppointments'
import AppointmentCard from '../../components/admin/appointments/AppointmentCard'
import AppointmentCalendar from '../../components/admin/appointments/AppointmentCalendar'
import AppointmentEditModal from '../../components/admin/appointments/AppointmentEditModal'
import ConfirmDialog from '../../components/admin/appointments/ConfirmDialog'
import type { Appointment } from '../../types/database'

type Tab = 'nieuw' | 'in-behandeling' | 'agenda'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'nieuw',          label: 'Nieuw',          icon: <Inbox size={15} /> },
  { id: 'in-behandeling', label: 'In behandeling', icon: <ClipboardList size={15} /> },
  { id: 'agenda',         label: 'Agenda',          icon: <Calendar size={15} /> },
]

export function AdminAppointments() {
  const {
    pending, confirmed, loading, error,
    updateStatus, updateAppointment, deleteAppointment,
  } = useAdminAppointments()

  const [activeTab, setActiveTab] = useState<Tab>('nieuw')
  const [editTarget, setEditTarget] = useState<Appointment | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleAccept(id: string) {
    await updateStatus(id, 'confirmed')
  }

  async function handleReject(id: string) {
    await updateStatus(id, 'cancelled')
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await deleteAppointment(deleteTarget)
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#1A1410]">Afspraken</h1>
        <p className="text-sm text-[#3D2B1F]/50 mt-1 font-body">
          Beheer afspraken, verwerk aanvragen en bekijk de agenda per kapper.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-[#C49A6C]/15">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-label uppercase tracking-wider border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-[#C49A6C] text-[#C49A6C]'
                : 'border-transparent text-[#3D2B1F]/50 hover:text-[#3D2B1F] hover:border-[#C49A6C]/30'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'nieuw' && pending.length > 0 && (
              <span className="ml-0.5 bg-[#C49A6C] text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-semibold leading-none">
                {pending.length > 9 ? '9+' : pending.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <div className="py-16 text-center text-[#3D2B1F]/40 font-label text-xs uppercase tracking-wider">
          Laden...
        </div>
      )}
      {!loading && error && (
        <div className="py-8 text-center text-red-600 text-sm font-body">{error}</div>
      )}

      {!loading && !error && (
        <>
          {/* Tab: Nieuw — overzicht zonder actieknoppen */}
          {activeTab === 'nieuw' && (
            <div className="space-y-3">
              {pending.length === 0
                ? <EmptyState icon={<Inbox size={32} />} message="Geen nieuwe afspraken" />
                : pending.map(a => (
                    <AppointmentCard key={a.id} appointment={a} showActions="none" />
                  ))
              }
            </div>
          )}

          {/* Tab: In behandeling — zelfde afspraken, nu met accept/afwijs-knoppen */}
          {activeTab === 'in-behandeling' && (
            <div className="space-y-3">
              {pending.length === 0
                ? <EmptyState icon={<ClipboardList size={32} />} message="Niets te verwerken" />
                : pending.map(a => (
                    <AppointmentCard
                      key={a.id}
                      appointment={a}
                      showActions="accept-reject"
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))
              }
            </div>
          )}

          {/* Tab: Agenda — kalender van bevestigde afspraken */}
          {activeTab === 'agenda' && (
            <AppointmentCalendar
              appointments={confirmed}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </>
      )}

      {/* Bewerkmodal */}
      {editTarget && (
        <AppointmentEditModal
          appointment={editTarget}
          onSave={patch => updateAppointment(editTarget.id, patch)}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Verwijder-bevestiging */}
      {deleteTarget && (
        <ConfirmDialog
          title="Afspraak verwijderen"
          description="Weet je zeker dat je deze afspraak wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-[#3D2B1F]/30">
      {icon}
      <p className="text-xs font-label uppercase tracking-wider">{message}</p>
    </div>
  )
}
