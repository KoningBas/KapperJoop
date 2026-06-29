import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import { useBusinessHours } from '../../hooks/useBusinessHours'
import { Button } from '../ui/Button'

const DAY_NAMES = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']

export function Footer() {
  const { settings } = useSettings()
  const { hours } = useBusinessHours()

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#2C1F14] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logo + tagline */}
        <div className="mb-14 pb-14 border-b border-[rgba(196,154,108,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src="/JoopLogo.png" alt="Kapper Joop" className="h-16 w-auto" />
              <div>
                <p
                  className="text-2xl font-bold text-[#D4B48C]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Kapper Joop
                </p>
                <p className="text-[#C49A6C] text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Shaves &amp; Trims – Men Only
                </p>
              </div>
            </div>
            <Button
              variant="copper"
              size="md"
              onClick={() => scrollTo('#reserveren')}
              className="self-start md:self-auto"
            >
              Boek een afspraak
            </Button>
          </div>
        </div>

        {/* Columns */}
        <div className="grid md:grid-cols-3 gap-12 mb-14">
          {/* Column 1 — Contact */}
          <div>
            <h3 className="text-[#C49A6C] text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "'Oswald', sans-serif" }}>
              Contact
            </h3>
            <div className="space-y-4">
              {settings?.barbershop_address && (
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-[#C49A6C] flex-shrink-0 mt-0.5" />
                  <span className="text-[#C9C0B4] text-sm leading-relaxed"
                    style={{ fontFamily: "'Lora', serif" }}>
                    {settings.barbershop_address}
                  </span>
                </div>
              )}
              {settings?.barbershop_phone && (
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-[#C49A6C] flex-shrink-0" />
                  <a href={`tel:${settings.barbershop_phone}`}
                    className="text-[#C9C0B4] hover:text-[#D4B48C] text-sm transition-colors"
                    style={{ fontFamily: "'Lora', serif" }}>
                    {settings.barbershop_phone}
                  </a>
                </div>
              )}
              {settings?.barbershop_email && (
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-[#C49A6C] flex-shrink-0" />
                  <a href={`mailto:${settings.barbershop_email}`}
                    className="text-[#C9C0B4] hover:text-[#D4B48C] text-sm transition-colors"
                    style={{ fontFamily: "'Lora', serif" }}>
                    {settings.barbershop_email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column 2 — Hours */}
          <div>
            <h3 className="text-[#C49A6C] text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "'Oswald', sans-serif" }}>
              Openingstijden
            </h3>
            <div className="space-y-2">
              {hours.map(h => (
                <div key={h.weekday} className="flex justify-between text-sm">
                  <span className="text-[#C9C0B4]" style={{ fontFamily: "'Lora', serif" }}>
                    {DAY_NAMES[h.weekday]}
                  </span>
                  <span
                    className={!h.is_open ? 'text-[#C9C0B4]/40' : 'text-[#D4B48C]'}
                    style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px' }}
                  >
                    {h.is_open && h.start_time && h.end_time
                      ? `${h.start_time.slice(0, 5)} – ${h.end_time.slice(0, 5)}`
                      : 'Gesloten'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 — Socials */}
          <div>
            <h3 className="text-[#C49A6C] text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "'Oswald', sans-serif" }}>
              Volg ons
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: 'Instagram', href: '#',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  ),
                },
                {
                  label: 'Facebook', href: '#',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Google Maps', href: '#',
                  icon: <MapPin size={14} />,
                },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 text-[#C9C0B4] hover:text-[#D4B48C] transition-colors group"
                >
                  <div className="w-8 h-8 flex items-center justify-center border border-[rgba(196,154,108,0.25)] group-hover:border-[rgba(196,154,108,0.5)] transition-colors text-[#C49A6C]">
                    {icon}
                  </div>
                  <span className="text-sm" style={{ fontFamily: "'Lora', serif" }}>{label}</span>
                  <ExternalLink size={11} className="opacity-40 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(196,154,108,0.1)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#C9C0B4]/50 text-xs" style={{ fontFamily: "'Lora', serif" }}>
            © 2026 Kapper Joop – Rijssen
          </p>
          <p className="text-[#C49A6C]/60 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ fontFamily: "'Oswald', sans-serif" }}>
            Shaves &amp; Trims – Men Only
          </p>
        </div>
      </div>
    </footer>
  )
}
