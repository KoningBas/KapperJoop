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
    <section id="diensten" className="py-14 bg-[#F5F0E8]">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <p
            className="font-semibold uppercase mb-3"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: '#7C5A28',
            }}
          >
            · DIENSTEN &amp; PRIJZEN ·
          </p>
          <h2
            className="font-bold tracking-[-0.02em] mb-3"
            style={{
              fontFamily: "'Playfair Display SC', serif",
              fontSize: 'clamp(26px, 3vw, 40px)',
              color: '#3D2B1F',
            }}
          >
            Diensten &amp; Prijzen
          </h2>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'rgba(61,43,31,0.75)',
            }}
          >
            Knippen, trimmen, scheren. Joop doet het al jaren. En dat zie je.
          </p>
        </div>

        {/* Top rule */}
        <div className="w-full h-px" style={{ background: 'rgba(61,43,31,0.12)' }} />

        {/* Price list */}
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="py-5 flex items-center justify-between gap-6 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded" style={{ background: 'rgba(61,43,31,0.08)', width: '35%' }} />
                    <div className="h-3 rounded" style={{ background: 'rgba(61,43,31,0.05)', width: '60%' }} />
                  </div>
                  <div className="h-7 w-20 rounded" style={{ background: 'rgba(61,43,31,0.07)' }} />
                </div>
                <div className="w-full h-px" style={{ background: 'rgba(61,43,31,0.1)' }} />
              </div>
            ))}
          </>
        ) : (
          <>
            {services.map((service, i) => (
              <div key={service.id}>
                <div
                  className="py-5 flex items-center gap-6 animate-fadeInUp cursor-default"
                  style={{
                    animationDelay: `${i * 55}ms`,
                    transition: 'background 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                    borderRadius: '3px',
                    marginLeft: '-12px',
                    paddingLeft: '12px',
                    marginRight: '-12px',
                    paddingRight: '12px',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(61,43,31,0.04)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                  }}
                >
                  {/* Name + description */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold uppercase leading-tight mb-0.5"
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: 'clamp(15px, 1.6vw, 19px)',
                        letterSpacing: '0.08em',
                        color: '#3D2B1F',
                      }}
                    >
                      {service.name}
                    </h3>
                    {service.description && (
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "'Lora', serif",
                          fontSize: '13px',
                          lineHeight: 1.5,
                          color: 'rgba(61,43,31,0.72)',
                        }}
                      >
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <span
                    className="font-semibold uppercase flex-shrink-0 hidden sm:block"
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      color: '#7C5A28',
                      minWidth: '56px',
                      textAlign: 'right',
                    }}
                  >
                    {service.duration_minutes} min
                  </span>

                  {/* Price */}
                  <span
                    className="font-bold flex-shrink-0 leading-none"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(22px, 2.8vw, 34px)',
                      letterSpacing: '-0.02em',
                      color: '#A07848',
                      minWidth: '64px',
                      textAlign: 'right',
                    }}
                  >
                    €{Number(service.price).toFixed(0)}
                  </span>

                  {/* Book */}
                  <Button
                    variant="copper"
                    size="sm"
                    className="rounded-full flex-shrink-0"
                    onClick={() => scrollToBooking(service.id)}
                  >
                    Boek
                  </Button>
                </div>
                <div className="w-full h-px" style={{ background: 'rgba(61,43,31,0.1)' }} />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  )
}
