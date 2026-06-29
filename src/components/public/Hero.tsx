import { Button } from '../ui/Button'
import { IMAGES } from '../../config/images'

export function Hero() {
  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden grain-overlay"
      style={{ background: '#1A1410', minHeight: '100svh' }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.hero}
          alt="Kapper Joop barbershop interieur"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay — exterior foto heeft meer dekking nodig voor leesbare tekst */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(26,20,16,0.78) 0%, rgba(26,20,16,0.60) 50%, rgba(44,31,20,0.50) 100%)'
        }} />
        {/* Warm copper bloom centraal */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 40% 60%, rgba(196,154,108,0.08) 0%, transparent 60%)'
        }} />
      </div>

      {/* Content — centered */}
      <div className="relative z-10 flex flex-col justify-center max-w-7xl mx-auto px-6 md:px-10 w-full" style={{ minHeight: '100svh', paddingTop: '96px', paddingBottom: '80px' }}>
        <div className="max-w-2xl">
          {/* H1 */}
          <h1
            className="text-[2.5rem] sm:text-5xl md:text-7xl lg:text-8xl font-bold text-[#FDFAF5] leading-none tracking-[-0.03em] mb-4 animate-fadeInUp"
            style={{ fontFamily: "'Playfair Display', serif", animationDelay: '80ms' }}
          >
            Kapper Joop
          </h1>

          {/* Tagline */}
          <p
            className="text-xl md:text-2xl text-[#D4B48C] italic mb-8 animate-fadeInUp"
            style={{ fontFamily: "'Playfair Display', serif", animationDelay: '160ms', letterSpacing: '0.01em' }}
          >
            Shaves &amp; Trims – Men Only
          </p>

          {/* Copper ornament divider */}
          <div className="flex items-center gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '220ms' }}>
            <div className="h-px w-12 bg-gradient-to-r from-[rgba(196,154,108,0.3)] to-[rgba(196,154,108,0.7)]" />
            <span className="text-[#C49A6C] text-xs" aria-hidden="true">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-[rgba(196,154,108,0.3)] to-[rgba(196,154,108,0.7)]" />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <Button
              variant="copper"
              size="lg"
              onClick={() => scrollTo('#reserveren')}
              className="hover:scale-105 transition-transform duration-200"
              style={{
                background: '#C49A6C',
                color: '#1A1410',
                boxShadow: '0 4px 24px rgba(196,154,108,0.35), 0 1px 4px rgba(26,20,16,0.3)',
              }}
            >
              Boek je knipbeurt
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollTo('#diensten')}
              className="border-[rgba(196,154,108,0.5)] text-[#D4B48C] hover:scale-105 transition-transform duration-200"
            >
              Bekijk diensten
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(26,20,16,0.5))' }}
      />
    </section>
  )
}
