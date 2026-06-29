import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'

const NAV_LINKS = [
  { label: 'Diensten', href: '#diensten' },
  { label: 'Over Joop', href: '#over-joop' },
  { label: 'Galerij', href: '#galerij' },
  { label: 'Reserveren', href: '#reserveren' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleNavClick(href: string) {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        style={{ fontFamily: "'Oswald', sans-serif" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#1A1410]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(26,20,16,0.5)]'
            : 'bg-[#1A1410]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18" style={{ height: '72px' }}>
          {/* Logo */}
          <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 flex-shrink-0">
            <img src="/JoopLogo.png" alt="Kapper Joop logo" className="h-14 w-auto" style={{ maxHeight: '56px' }} />
          </a>

          {/* Desktop nav + CTA grouped right */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-[#D4B48C] hover:text-[#C49A6C] text-sm font-semibold uppercase tracking-widest transition-colors duration-200 focus-visible:outline-none focus-visible:text-[#C49A6C] cursor-pointer bg-transparent border-none"
              >
                {link.label}
              </button>
            ))}
            <Button
              variant="copper"
              size="sm"
              className="hover:scale-105 transition-transform duration-200"
              onClick={() => handleNavClick('#reserveren')}
            >
              Boek een afspraak
            </Button>
          </div>

          {/* Hamburger mobile */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              className="text-[#C49A6C] p-1 focus-visible:outline-[#C49A6C] cursor-pointer bg-transparent border-none"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu openen"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#1A1410] flex flex-col pt-24 px-8 pb-8 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6">
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-[#D4B48C] hover:text-[#C49A6C] text-2xl font-semibold uppercase tracking-widest text-left transition-colors duration-200 cursor-pointer bg-transparent border-none"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <Button
            variant="copper"
            size="lg"
            className="w-full"
            onClick={() => handleNavClick('#reserveren')}
          >
            Boek een afspraak
          </Button>
        </div>
      </div>
    </>
  )
}
