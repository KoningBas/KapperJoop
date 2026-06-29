import { IMAGES } from '../../config/images'

export function About() {
  return (
    <section id="over-joop" className="py-24 bg-[#FDFAF5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text column */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold italic text-[#1A1410] leading-tight tracking-[-0.02em] mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Over Joop
            </h2>

            {/* Copper ornament line — left-aligned to match layout */}
            <div className="flex items-center gap-3 mb-8 max-w-xs">
              <span className="text-[#C49A6C] text-xs" aria-hidden="true">✦</span>
              <div className="h-px flex-1 bg-gradient-to-r from-[rgba(196,154,108,0.7)] to-[rgba(196,154,108,0.0)]" />
            </div>

            <div className="space-y-5 text-[#3D2B1F]/80 text-lg leading-[1.75]"
              style={{ fontFamily: "'Lora', serif" }}>
              <p>
                Joop knipt al langer dan hij zich kan herinneren, en dat zegt wat. In het hart van Rijssen staat zijn zaak: geen fratsen, geen föhnkapper, gewoon een man die weet wat hij doet.
              </p>
              <p>
                In de stoel bij Joop weet je waar je aan toe bent. Vertel wat je wil, hij knipt het. Weet je het zelf niet precies? Hij vraagt door tot het klopt. Rijssen loopt er al jaren goed bij.
              </p>
              <p>
                Met een schaar, een goed verhaal en af en toe een mening die je niet gevraagd hebt. Men Only. Altijd al geweest.
              </p>
            </div>
          </div>

          {/* Image column */}
          <div className="relative">
            <div className="relative overflow-hidden"
              style={{
                boxShadow: '0 4px 16px rgba(196,154,108,0.14), 0 16px 48px rgba(26,20,16,0.22)',
                border: '1px solid rgba(196,154,108,0.2)',
              }}
            >
              <img
                src={IMAGES.about}
                alt="Kapper Joop aan het werk"
                className="w-full h-[560px] object-cover"
              />
              {/* Color treatment overlay */}
              <div className="absolute inset-0"
                style={{ background: 'rgba(196,154,108,0.06)', mixBlendMode: 'multiply' }}
              />
            </div>
            {/* Decorative copper corner */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-l-2 border-b-2 border-[rgba(196,154,108,0.4)]" />
            <div className="absolute -top-4 -right-4 w-16 h-16 border-r-2 border-t-2 border-[rgba(196,154,108,0.4)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
