import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PublicSite } from './pages/PublicSite'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminGuard } from './components/admin/AdminGuard'
import { AdminOverview } from './pages/admin/AdminOverview'
import { AdminAppointments } from './pages/admin/AdminAppointments'
import { AdminServices } from './pages/admin/AdminServices'
import { AdminHours } from './pages/admin/AdminHours'
import { AdminBlocked } from './pages/admin/AdminBlocked'
import { AdminSettings } from './pages/admin/AdminSettings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/hours" element={<AdminHours />} />
              <Route path="/admin/blocked" element={<AdminBlocked />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
