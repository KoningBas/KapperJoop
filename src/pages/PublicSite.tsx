import { useState } from 'react'
import { Navbar } from '../components/public/Navbar'
import { Hero } from '../components/public/Hero'
import { Services } from '../components/public/Services'
import { Gallery } from '../components/public/Gallery'
import { About } from '../components/public/About'
import { Reviews } from '../components/public/Reviews'
import { Booking } from '../components/public/Booking'
import { Footer } from '../components/public/Footer'

export function PublicSite() {
  const [preselectServiceId, setPreselectServiceId] = useState<string | null>(null)

  return (
    <div>
      <Navbar />
      <Hero />
      <Services onBookService={(id) => setPreselectServiceId(id)} />
      <Gallery />
      <About />
      <Reviews />
      <Booking preselectServiceId={preselectServiceId} />
      <Footer />
    </div>
  )
}
