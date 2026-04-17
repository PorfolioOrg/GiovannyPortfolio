import { lazy, Suspense } from 'react'
import { site } from '../data/siteContent'
import './Hero.css'

const HeroBackground3D = lazy(() =>
  import('./HeroBackground3D').then((mod) => ({ default: mod.HeroBackground3D })),
)

export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <Suspense fallback={null}>
        <HeroBackground3D />
      </Suspense>
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__name">
          {site.name}
        </h1>
        <p className="hero__tagline">{site.tagline}</p>
      </div>
    </section>
  )
}
