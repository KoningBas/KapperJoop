import { useServices } from '../../hooks/useServices'
import { Button } from '../ui/Button'

interface ServicesProps {
  onBookService?: (serviceId: string) => void
}

export function Services({ onBookService }: ServicesProps) {
  const { services, loading } = useServices(true)

  function scrollToBooking(serviceId?: string) {
    if (onBookService && serviceId) onBookService(serviceId)
    document.querySelector('#reserveren')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="diensten"
      className="relative py-24 bg-[#1A1410] grain-overlay overflow-hidden"
    >
      {/* Radial gradients */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 5% 10%, rgba(196,154,108,0.07) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 40% 35% at 95% 90%, rgba(44,31,20,0.5) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <p
            className="text-[#C49A6C] font-semibold uppercase mb-4"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.22em',
            }}
          >
            · DIENSTEN &amp; PRIJZEN ·
          </p>
          <h2
            className="text-[#F5F0E8] font-bold tracking-[-0.02em] mb-4"
            style={{
              fontFamily: "'Playfair Display SC', serif",
              fontSize: 'clamp(36px, 4.5vw, 56px)',
            }}
          >
            Diensten &amp; Prijzen
          </h2>
          <p
            className="text-[rgba(245,240,232,0.55)]"
            style={{ fontFamily: "'Lora', serif", fontSize: '16px', lineHeight: 1.7 }}
          >
            Knippen, trimmen, scheren. Joop doet het al jaren. En dat zie je.
          </p>
        </div>

        {/* Top rule */}
        <div className="w-full h-px" style={{ background: 'rgba(196,154,108,0.3)' }} />

        {/* Price list rows */}
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="py-7 flex items-center justify-between gap-6 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-5 rounded" style={{ background: 'rgba(196,154,108,0.1)', width: '40%' }} />
                    <div className="h-3 rounded" style={{ background: 'rgba(196,154,108,0.06)', width: '65%' }} />
                  </div>
                  <div className="h-8 w-24 rounded" style={{ background: 'rgba(196,154,108,0.08)' }} />
                </div>
                <div className="w-full h-px" style={{ background: 'rgba(196,154,108,0.15)' }} />
              </div>
            ))}
          </>
        ) : (
          <>
            {services.map((service, i) => (
              <div key={service.id}>
                <div
                  className="py-7 flex items-center gap-6 animate-fadeInUp group cursor-default"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    transition: 'background 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    borderRadius: '4px',
                    marginLeft: '-16px',
                    paddingLeft: '16px',
                    marginRight: '-16px',
                    paddingRight: '16px',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(196,154,108,0.05)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                  }}
                >
                  {/* Left: name + description */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-[#F5F0E8] font-semibold uppercase leading-tight mb-1"
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: 'clamp(17px, 2vw, 22px)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {service.name}
                    </h3>
                    {service.description && (
                      <p
                        className="text-[rgba(245,240,232,0.45)] truncate"
                        style={{ fontFamily: "'Lora', serif", fontSize: '13px', lineHeight: 1.6 }}
                      >
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <span
                    className="text-[#C49A6C] font-semibold uppercase flex-shrink-0 hidden sm:block"
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      minWidth: '60px',
                      textAlign: 'right',
                    }}
                  >
                    {service.duration_minutes} min
                  </span>

                  {/* Price */}
                  <span
                    className="text-[#C49A6C] font-bold flex-shrink-0 leading-none"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(28px, 3.5vw, 42px)',
                      letterSpacing: '-0.02em',
                      minWidth: '72px',
                      textAlign: 'right',
                    }}
                  >
                    €{Number(service.price).toFixed(0)}
                  </span>

                  {/* Book button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full flex-shrink-0"
                    onClick={() => scrollToBooking(service.id)}
                  >
                    Boek
                  </Button>
                </div>
                <div
                  className="w-full h-px"
                  style={{ background: 'rgba(196,154,108,0.18)' }}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  )
}
