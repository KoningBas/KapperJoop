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
    <section id="diensten" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-bold text-[#3D2B1F] tracking-[-0.02em] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Diensten &amp; Prijzen
          </h2>
          <p className="text-[#3D2B1F]/75 text-lg max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Lora', serif" }}>
            Knippen, trimmen, scheren. Joop doet het al jaren. En dat zie je.
          </p>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-[#FDFAF5] h-48 animate-pulse rounded-2xl border border-[rgba(196,154,108,0.15)]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="group bg-[#FDFAF5] rounded-2xl p-7 flex flex-col gap-4 animate-fadeInUp"
                style={{
                  border: '1px solid rgba(196,154,108,0.2)',
                  boxShadow: '0 2px 12px rgba(196,154,108,0.07), 0 8px 32px rgba(26,20,16,0.06)',
                  animationDelay: `${i * 80}ms`,
                  transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(196,154,108,0.14), 0 16px 48px rgba(26,20,16,0.1)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(196,154,108,0.07), 0 8px 32px rgba(26,20,16,0.06)'
                }}
              >
                {/* Top row: name + price */}
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="text-2xl font-bold text-[#3D2B1F] leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.name}
                  </h3>
                  <span
                    className="text-3xl font-bold text-[#C49A6C] flex-shrink-0 leading-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    €{Number(service.price).toFixed(0)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[#3D2B1F]/75 text-base leading-relaxed"
                  style={{ fontFamily: "'Lora', serif" }}>
                  {service.description}
                </p>

                {/* Bottom row: duration + book */}
                <div className="flex items-center justify-between pt-2 mt-auto">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest text-[#A07848]"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {service.duration_minutes} min
                  </span>
                  <Button
                    variant="copper"
                    size="sm"
                    className="rounded-full"
                    onClick={() => scrollToBooking(service.id)}
                  >
                    Boek direct
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
