import { useState } from 'react'
import { useAdminAppointments } from '../../hooks/useAdminAppointments'
import AppointmentCalendar from '../../components/admin/appointments/AppointmentCalendar'
import AppointmentEditModal from '../../components/admin/appointments/AppointmentEditModal'
import ConfirmDialog from '../../components/admin/appointments/ConfirmDialog'
import type { Appointment } from '../../types/database'

export function AdminAppointments() {
  const {
    confirmed, loading, error,
    updateAppointment, deleteAppointment,
  } = useAdminAppointments()

  const [editTarget, setEditTarget] = useState<Appointment | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

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
        <h1 className="font-display text-3xl text-[#1A1410]">Agenda</h1>
        <p className="text-sm text-[#3D2B1F]/50 mt-1 font-body">
          Bekijk en beheer afspraken per kapper.
        </p>
      </div>

      {loading && (
        <div className="py-16 text-center text-[#3D2B1F]/40 font-label text-xs uppercase tracking-wider">
          Laden...
        </div>
      )}
      {!loading && error && (
        <div className="py-8 text-center text-red-600 text-sm font-body">{error}</div>
      )}
      {!loading && !error && (
        <AppointmentCalendar
          appointments={confirmed}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
        />
      )}

      {editTarget && (
        <AppointmentEditModal
          appointment={editTarget}
          onSave={patch => updateAppointment(editTarget.id, patch)}
          onClose={() => setEditTarget(null)}
        />
      )}

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
