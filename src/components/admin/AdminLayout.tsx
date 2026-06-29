import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Scissors, Clock, CalendarOff,
  Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overzicht', icon: LayoutDashboard, end: true },
  { to: '/admin/appointments', label: 'Afspraken', icon: Calendar },
  { to: '/admin/services', label: 'Diensten', icon: Scissors },
  { to: '/admin/hours', label: 'Openingstijden', icon: Clock },
  { to: '/admin/blocked', label: 'Geblokkeerde data', icon: CalendarOff },
  { to: '/admin/settings', label: 'Instellingen', icon: Settings },
]

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[rgba(196,154,108,0.1)]">
        <div className="flex items-center gap-3">
          <img src="/JoopLogo.png" alt="Kapper Joop" className="h-10 w-auto" />
          <div>
            <p className="text-sm font-bold text-white" style={{ fontFamily: 'system-ui' }}>
              Kapper Joop
            </p>
            <p className="text-xs text-[#C49A6C]/70">Admin dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors duration-150 group ${
                isActive
                  ? 'bg-[rgba(196,154,108,0.15)] text-[#C49A6C]'
                  : 'text-[#C9C0B4] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={12} className="text-[#C49A6C]/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-[rgba(196,154,108,0.1)]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-[#C9C0B4] hover:text-white hover:bg-white/5 rounded transition-colors duration-150"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Uitloggen</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1A1410] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-64 bg-[#1A1410] flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(196,154,108,0.1)]">
              <span className="text-white text-sm font-semibold">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="text-[#C49A6C]">
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 p-1">
            <Menu size={20} />
          </button>
          <img src="/JoopLogo.png" alt="Kapper Joop" className="h-8 w-auto" />
          <div className="w-7" />
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
