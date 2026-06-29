import { IMAGES } from '../../config/images'

const GALLERY_CAPTIONS = [
  'Vakwerk aan het werk',
  'Precisie tot in detail',
  'Het klassieke scheermes',
  'Interieur van de zaak',
  'Baard in model',
]

export function Gallery() {
  return (
    <section id="galerij" className="py-24 bg-[#1A1410]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <h2
            className="text-5xl md:text-6xl font-bold italic text-[#FDFAF5] tracking-[-0.02em] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Het Ambacht
          </h2>
          <p className="text-[#C49A6C] text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ fontFamily: "'Oswald', sans-serif" }}>
            Vakwerk, van dichtbij
          </p>
        </div>

        {/* Masonry-style grid — only first 5 images */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {IMAGES.gallery.slice(0, 5).map((src, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden bg-[#2C1F14] ${i === 0 ? 'md:row-span-2' : ''}`}
              style={{
                aspectRatio: i === 0 ? 'auto' : '4/3',
                minHeight: i === 0 ? '400px' : undefined,
              }}
            >
              <img
                src={src}
                alt={GALLERY_CAPTIONS[i] || 'Kapper Joop barbershop'}
                className="w-full h-full object-cover transition-transform duration-700"
                style={{ transform: 'scale(1)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(26,20,16,0.8) 0%, rgba(26,20,16,0.2) 60%, transparent 100%)' }}
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-[#D4B48C] text-xs font-semibold uppercase tracking-widest"
                  style={{ fontFamily: "'Oswald', sans-serif" }}>
                  {GALLERY_CAPTIONS[i]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
