import { ExternalLink } from 'lucide-react'

const REVIEWS = [
  {
    text: 'Beste kapper van Rijssen, en dat zonder discussie.',
    author: 'Henk V.',
    stars: 5,
  },
  {
    text: 'Joop knipt precies zoals je wil, ook al leg je het slecht uit.',
    author: 'Mark de B.',
    stars: 5,
  },
  {
    text: 'Snel, scherp en een goed gesprek erbij. Meer heb je niet nodig.',
    author: 'Thomas R.',
    stars: 5,
  },
]

export function Reviews() {
  return (
    <section className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#3D2B1F] tracking-[-0.02em]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Wat Rijssen zegt
          </h2>
        </div>

        {/* Review cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="bg-[#FDFAF5] rounded-2xl p-8 flex flex-col gap-4 animate-fadeInUp"
              style={{
                border: '1px solid rgba(196,154,108,0.22)',
                boxShadow: '0 2px 8px rgba(196,154,108,0.08), 0 8px 32px rgba(26,20,16,0.06)',
                animationDelay: `${i * 100}ms`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(review.stars)].map((_, s) => (
                  <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill="#A07848" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Decorative quote mark */}
              <div className="text-5xl leading-none text-[#C49A6C] opacity-30 select-none -mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }} aria-hidden="true">
                "
              </div>

              {/* Quote */}
              <p
                className="text-[#3D2B1F] text-lg italic leading-relaxed flex-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {review.text}
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-[rgba(196,154,108,0.18)]">
                <span className="text-[#7C5A28] text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Oswald', sans-serif" }}>
                  — {review.author}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews link */}
        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/search/Kapper+Joop+Rijssen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#7C5A28] hover:text-[#A07848] transition-colors text-sm font-semibold uppercase tracking-widest group"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Bekijk alle reviews op Google
            <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  )
}
